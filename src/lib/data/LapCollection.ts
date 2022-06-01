// import { TelemetryDataArray } from '../lib';
// import { TelemetryDataRow } from './types';
// import TelemetryLap from './TelemetryLap';

// export class LapCollection {
//   laps: TelemetryLap[] = [];
//   lastLapNum = 0;
//   lastLap: TelemetryLap | null = null;
//   currentLap: TelemetryLap | null = null;

//   clear() {
//     this.laps = [];
//     this.lastLap = null;
//     this.currentLap = null;
//   }

//   add(dataRow: TelemetryDataRow) {
//     const row = this.convertTelemetryArray(dataRow);
//     if (!this.lastLap || row.lap > this.lastLap.lap) {
//       this.createLap(row);
//     }
//     this.currentLap?.add(row);
//     return row;
//   }

//   addAll(dataRows: TelemetryDataRow[]) {
//     dataRows.forEach((row) => {
//       this.add(row);
//     });
//   }

//   createLap(row: TelemetryDataArray) {
//     const lap = new TelemetryLap(row.lap);
//     this.laps.push(lap);
//     this.lastLap = this.currentLap;
//     this.currentLap = lap;

//     if (this.lastLap && row.lastLapTime) {
//       this.lastLap.updateTime(row.lastLapTime);
//     }
//   }

//   convertTelemetryArray(dataRow: TelemetryDataRow): TelemetryDataArray {
//     const headerOffset = dataRow.length === 86 ? 1 : 0;
//     return dataRow.reduce((acc, value, index) => ({
//       ...acc,
//       [headers[index + headerOffset]]: value,
//     }), { epochMs: 0 } as TelemetryDataArray);
//   }
// }
