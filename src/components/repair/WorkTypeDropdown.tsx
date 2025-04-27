import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WorkTypeDropdown = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const workTypes = [
    { value: "plumbing", label: "งานประปา" },
    { value: "electrical", label: "งานไฟฟ้า" },
    { value: "hvac", label: "งานแอร์" },
    { value: "sanitary", label: "งานสุขาภิบาล" },
    { value: "furniture", label: "งานเฟอร์นิเจอร์" },
    { value: "other", label: "อื่น ๆ" },
  ];

  return (
    <div className="space-y-2">
      <Label>ประเภทงานซ่อม</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="เลือกประเภทงาน" />
        </SelectTrigger>
        <SelectContent>
          {workTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WorkTypeDropdown;
