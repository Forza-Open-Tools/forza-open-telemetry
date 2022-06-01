import { TelemetryDataArray, TelemetryDataArrayWrapper } from '../lib/data';
import { Race } from '../lib/data/Race';

export class TelemetryJsonParser {
  // intentionally not reactive
  isRaceOn = false;
  currentRace: Race | null = null;
  rows: TelemetryDataArray[] = [];
  races: Race[] = [];
  count = 0;

  processDataArray(raw: TelemetryDataArray) {
    const data = new TelemetryDataArrayWrapper(raw);

    if (!data.byName('isRaceOn')) {
      this.isRaceOn = false;
      // Finalize the current race?
    } else {
      if (!this.currentRace || !this.isRaceOn) {
        this.currentRace = new Race(data);
        this.races.push(this.currentRace);
      }
      // if (!this.isRaceOn) {
      //   console.log('first row found', raw.length, data.dataArray.length);
      //   console.log(data.dataArray);
      // }
      this.isRaceOn = true;
      this.currentRace!.add(data);
      this.count += 1;
    }
  }

  private parseLines(text: string) {
    const lines = text.split(/\r?\n/g);

    lines.forEach((line, index) => {
      if (line.trim()) { //  && this.count < 200
        try {
          const row = JSON.parse(line) as TelemetryDataArray;
          this.processDataArray(row);
        } catch (error) {
          console.error('Error parsing line', index);
          console.log(line);
        }
      }
    });
  }

  parseFile(file: File): Promise<Race[]> {
    this.isRaceOn = false;
    this.currentRace = null;
    this.rows = [];
    this.races = [];
    this.count = 0;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result: string = event.target?.result as string || '';
        const rows = this.parseLines(result);
        resolve(this.races);
      }
      reader.readAsText(file);
    });
  }
}
