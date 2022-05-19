import { TelemetryDataArray } from 'forza-open-telemetry-server';

export function useTelemetryJsonParser() {
  function parseText(text: string) {
    const lines = text.split(/\r?\n/g);
    const rows: TelemetryDataArray[] = [];
    lines.forEach((line, index) => {
      if (line.trim()) {
        try {
          rows.push(JSON.parse(line) as TelemetryDataArray);
        } catch (error) {
          console.error('Error parsing line', index);
          console.log(line);
        }
      }
    });
    return rows;
  }

  function parseFile(file: File): Promise<TelemetryDataArray[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result: string = event.target?.result as string || '';
        const rows = parseText(result);
        resolve(rows);
      }
      reader.readAsText(file);
    })
  }

  return {
    parseFile,
  };
}
