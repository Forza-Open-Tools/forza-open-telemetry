import { Race } from '../lib/data/Race';
import { TelemetryDataRow } from './TelemetryDataRow';
import { TelemetryFormat } from 'forza-open-telemetry-server';
import { PropertyToIndexMap} from './PropertyToIndexMap';
import { dashFormatLabels } from './dash-format-labels';

const formatLabelsMap: Record<string, PropertyToIndexMap> = {
  'Dash': new PropertyToIndexMap(dashFormatLabels),
}

export class TelemetryJsonParser {
  // intentionally not reactive
  isRaceOn = false;
  currentRace: Race | null = null;
  rows: number[][] = [];
  races: Race[] = [];
  count = 0;

  propMap: PropertyToIndexMap;

  constructor(format: TelemetryFormat) {
    this.propMap = formatLabelsMap[format];
  }

  useFormat(format: TelemetryFormat) {
    this.propMap = formatLabelsMap[format];
  }

  processDataArray(raw: number[]) {
    const data = new TelemetryDataRow(this.propMap, raw);

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
          const row = JSON.parse(line) as number[];
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
