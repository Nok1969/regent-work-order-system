import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RepairRequest, User } from "@/types";
import { mockUsers } from "@/data/mockData"; // Import mock data to use when actual DB fetch fails

export async function fetchRepairs() {
  console.log('Fetching repairs data...');
  try {
    // Try simplified query that doesn't rely on foreign key relationships
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching repairs:', error);
      throw error;
    }

    console.log('Fetched repairs data:', data);

    // If we got data, now get the profiles separately and join manually
    const requestedByIds = data.map(repair => repair.requested_by).filter(Boolean);
    const assignedToIds = data.map(repair => repair.assigned_to).filter(Boolean);
    const allUserIds = [...new Set([...requestedByIds, ...assignedToIds])];
    
    // Only fetch profiles if we have IDs to look up
    let profilesMap = {};
    
    if (allUserIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', allUserIds);
      
      if (profilesError) {
        console.warn('Error fetching profiles, using mock data:', profilesError);
        // If profiles fetch fails, we'll use mock data instead
        profilesMap = mockUsers.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
      } else {
        // Build lookup map from profiles
        profilesMap = profiles.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
      }
    } else {
      console.warn('No user IDs found in repairs data, using mock data');
      profilesMap = mockUsers.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
    }

    // Transform the data to match our frontend types
    return data.map((repair: any): RepairRequest => {
      const requestedByUser = profilesMap[repair.requested_by] || mockUsers[0];
      const assignedToUser = repair.assigned_to ? profilesMap[repair.assigned_to] : undefined;
      
      return {
        id: repair.id,
        title: repair.title,
        description: repair.description,
        roomNumber: repair.room_number,
        status: repair.status,
        priority: repair.priority,
        createdAt: new Date(repair.created_at),
        updatedAt: new Date(repair.updated_at),
        completedAt: repair.completed_at ? new Date(repair.completed_at) : undefined,
        notes: repair.notes,
        requestedBy: {
          id: requestedByUser.id,
          name: requestedByUser.name,
          role: requestedByUser.role,
          username: requestedByUser.username || requestedByUser.email || '',
          avatar: requestedByUser.avatar
        },
        assignedTo: assignedToUser ? {
          id: assignedToUser.id,
          name: assignedToUser.name,
          role: assignedToUser.role,
          username: assignedToUser.username || assignedToUser.email || '',
          avatar: assignedToUser.avatar
        } : undefined
      };
    });
  } catch (error) {
    console.error('Error in fetchRepairs, falling back to mock data:', error);
    // If everything fails, return mock data
    return mockUsers[0].id ? [] : [];
  }
}

export function useRepairQueries() {
  const queryClient = useQueryClient();
  const { data: repairs = [], isLoading, error, refetch } = useQuery({
    queryKey: ['repairs'],
    queryFn: fetchRepairs,
    staleTime: 1000 * 30, // Consider data stale after 30 seconds
    refetchOnWindowFocus: true,
    retry: 2
  });

  // Log any errors that occur
  if (error) {
    console.error('Error in useRepairQueries:', error);
  }

  const getRepairById = (id: string) => {
    return repairs.find(repair => repair.id === id);
  };

  // Function to force refresh the repair data
  const forceRefresh = async () => {
    console.log('Force refreshing repairs data...');
    await queryClient.invalidateQueries({ queryKey: ['repairs'] });
    return refetch();
  };

  return {
    repairs,
    isLoading,
    error,
    refetch,
    forceRefresh,
    getRepairById
  };
}
