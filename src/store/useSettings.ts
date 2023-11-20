import { TelemetryFormat } from 'forza-open-telemetry-server';
import { defineStore } from 'pinia';

interface AppSettings {
  telemetryServer: string;
  format: TelemetryFormat;

}

export const useSettings = defineStore('settings', {
  state: (): AppSettings => ({
    telemetryServer: 'http://localhost:5555',
    format: 'Dash',
  }),
});
