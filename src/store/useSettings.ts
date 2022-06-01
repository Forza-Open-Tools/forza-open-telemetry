import { defineStore } from 'pinia';

interface AppSettings {
  telemetryServer: string;

}

export const useSettings = defineStore('settings', {
  state: (): AppSettings => ({
    telemetryServer: 'http://localhost:9999',
  }),
});
