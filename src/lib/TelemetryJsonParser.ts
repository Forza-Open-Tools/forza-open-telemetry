import { Race } from '../lib/data/Race';
import { TelemetryDataRow } from './TelemetryDataRow';
import { TelemetryFormat } from 'forza-open-telemetry-server';
import { PropertyToIndexMap} from './PropertyToIndexMap';
import { dashFormatLabels } from './formats/dash-format-labels';
import { fh5FormatLabels } from './formats/fh5-format-labels';

const formatLabelsMap: Record<string, PropertyToIndexMap> = {
  'Dash': new PropertyToIndexMap(dashFormatLabels),
  'FH5': new PropertyToIndexMap(fh5FormatLabels),
}

console.log('Dash labels length', dashFormatLabels.length);
console.log('FH5 labels length', fh5FormatLabels.length);

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

  useFormatFor(raw: number[]) {
    const map = Object.values(formatLabelsMap).find(map => map.length === raw.length);
    if (map) {
      this.propMap = map;
    } else {
      throw new Error(`No format found for ${raw.length} properties`);
    }
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

    const previousMap = this.propMap;
    this.useFormatFor(JSON.parse(lines[0]))

    lines.forEach((line, index) => {
      if (line.trim()) { //  && this.count < 200
        try {
          const row = JSON.parse(line) as number[];
          this.processDataArray(row);
        } catch (error) {
          console.error('Error parsing line', index + 1, '\n', line);
          // console.log(line);
        }
      }
    });

    this.propMap = previousMap;
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
        this.parseLines(result);
        resolve(this.races);
      }
      reader.readAsText(file);
    });
  }
}
