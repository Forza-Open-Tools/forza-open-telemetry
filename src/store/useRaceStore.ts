import { defineStore } from 'pinia';
import { getLapColorClass } from '../lib';
import { IRace, ITelemetryDataPoint, ITelemetryLap, LapColorClasses } from '../lib/types';

interface UseRaceStoreState {
  races: IRace[],
  selected: {
    race: number;
    lap: number;
    moment: number;
  };
  lapColorClasses: LapColorClasses[];
}

export const useRaceStore = defineStore('racestore', {
  state: (): UseRaceStoreState => ({
    races: [],
    selected: {
      race: -1,
      lap: -1,
      moment: -1,
    },
    lapColorClasses: [],
  }),
  getters: {
    selectedRace(state): IRace | null {
      if (state.selected.race < 0) return null;
      return state.races[state.selected.race];
    },
    selectedLap(state): ITelemetryLap | null {
      if (state.selected.lap < 0) return null;
      return this.selectedRace?.laps[state.selected.lap] || null;
    },
    currentDataPoint(state): ITelemetryDataPoint | null {
      if (state.selected.moment < 0) return null;
      return this.selectedLap?.telemetry[state.selected.moment] || null;
    }
  },
  actions: {
    selectRace(raceIndex: number) {
      this.selected.race = raceIndex;
      this.selected.lap = 0;
      this.selected.moment = 0;
      this.lapColorClasses = this.races[raceIndex].laps.map((lap) => getLapColorClass(lap.lap));
    },
    selectLap(lapIndex: number) {
      if (lapIndex < this.selectedRace!.laps.length) {
        this.selected.lap = lapIndex;
      }
      const momentsLength = this.selectedRace?.laps[lapIndex].telemetry.length || 0;
      if (this.selected.moment >= momentsLength) {
        this.selected.moment = 0;
      }
    },
    setTelemetryIndex(index: number) {
      const maxLen = this.selectedLap!.telemetry.length;
      this.selected.moment = Math.max(Math.min(maxLen, index), 0);
    },
    addRace(race: IRace) {
      this.races.push(race);
    },
  },
});
