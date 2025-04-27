
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e98319da642e4cfca3e7acb639b5a8cb',
  appName: 'hotel-repair-beacon',
  webDir: 'dist',
  server: {
    url: 'https://e98319da-642e-4cfc-a3e7-acb639b5a8cb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
