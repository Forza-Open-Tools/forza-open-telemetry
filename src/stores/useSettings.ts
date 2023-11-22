import { TelemetryFormat } from 'forza-open-telemetry-server';
import { defineStore } from 'pinia';

interface AppSettings {
  telemetryServer: string;
  format: TelemetryFormat;
  show: {
    travelPath: boolean;
    currentStats: boolean;
    telemetryTable: boolean;
  };
}

export const useSettings = defineStore('settings', {
  state: (): AppSettings => ({
    telemetryServer: 'http://localhost:5555',
    format: 'Dash',
    show: {
      travelPath: true,
      currentStats: true,
      telemetryTable: true,
    },
  }),
});
