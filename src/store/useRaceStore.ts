import { defineStore } from 'pinia';
import { getLapColorClass } from '../lib';
import { IRace, ITelemetryDataPoint, ITelemetryLap, LapColorClasses } from '../lib/types';

interface UseRaceStoreState {
  selectedIndex: number;
  selectedRace: IRace | null;
  selectedLapIndex: number;
  currentDataPointIndex: number;
  lapColorClasses: LapColorClasses[];
}

export const useRaceStore = defineStore('racestore', {
  state: (): UseRaceStoreState => ({
    selectedIndex: -1,
    selectedRace: null,
    selectedLapIndex: -1,
    currentDataPointIndex: -1,
    lapColorClasses: [],
  }),
  getters: {
    selectedLap(state): ITelemetryLap | null {
      if (!state.selectedRace) return null;
      return state.selectedRace.laps[state.currentDataPointIndex];
    },
    currentDataPoint(state): ITelemetryDataPoint | null {
      if (!this.selectedLap) return null;
      return this.selectedLap.telemetry[state.currentDataPointIndex];
    }
  },
  actions: {
    selectRace(race: IRace) {
      this.selectedRace = race;
      this.selectedLapIndex = 0;
      this.lapColorClasses = race.laps.map((lap) => getLapColorClass(lap.lap));
    },
    selectLap(lapIndex: number) {
      if (lapIndex < this.selectedRace!.laps.length)
        this.selectedLapIndex = lapIndex;
    },
    setTelemetryIndex(index: number) {
      const maxLen = this.selectedRace!.laps.length
      this.currentDataPointIndex = Math.max(Math.min(maxLen, index), 0);
    }
  }
});
