/**
 * CSV Parser for Body Metrics Import
 * Handles parsing and validation of CSV files for body metrics data
 */

export interface ParsedBodyMetric {
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercent?: number;
  muscleMassKg?: number;
}

export interface CSVMapping {
  dateColumn: number;
  weightColumn: number;
  bodyFatColumn?: number;
  muscleMassColumn?: number;
  dateFormat?: string; // e.g., "YYYY-MM-DD", "DD/MM/YYYY"
}

/**
 * Parse CSV text and detect columns
 * Returns array of rows with auto-detected column indices
 */
export function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split('\n');
  return lines.map(line => {
    // Simple CSV parsing (handles basic cases, not quoted fields)
    return line.split(',').map(cell => cell.trim());
  });
}

/**
 * Auto-detect column indices by looking for common headers
 */
export function detectColumns(headerRow: string[]): Partial<CSVMapping> {
  const mapping: Partial<CSVMapping> = {};

  const dateKeywords = ['date', '日期', 'day', 'time', '時間'];
  const weightKeywords = ['weight', '體重', 'kg', '公斤'];
  const bodyFatKeywords = ['fat', '體脂', 'bodyfat', '脂肪'];
  const muscleMassKeywords = ['muscle', '肌肉', 'ffm', '淨體重'];

  headerRow.forEach((header, index) => {
    const lowerHeader = header.toLowerCase();
    
    if (dateKeywords.some(kw => lowerHeader.includes(kw))) {
      mapping.dateColumn = index;
    }
    if (weightKeywords.some(kw => lowerHeader.includes(kw))) {
      mapping.weightColumn = index;
    }
    if (bodyFatKeywords.some(kw => lowerHeader.includes(kw))) {
      mapping.bodyFatColumn = index;
    }
    if (muscleMassKeywords.some(kw => lowerHeader.includes(kw))) {
      mapping.muscleMassColumn = index;
    }
  });

  return mapping;
}

/**
 * Parse date string to YYYY-MM-DD format
 */
export function parseDate(dateStr: string, format?: string): string | null {
  const trimmed = dateStr.trim();
  
  // Try ISO format first
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  
  // Try DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split('/');
    return `${year}-${month}-${day}`;
  }
  
  // Try MM/DD/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const [m, d, y] = parts;
      const month = parseInt(m);
      const day = parseInt(d);
      if (month > 0 && month <= 12 && day > 0 && day <= 31) {
        return `${y}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
    }
  }
  
  // Try YYYY/MM/DD
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('/');
    return `${year}-${month}-${day}`;
  }

  return null;
}

/**
 * Parse a single row using the provided mapping
 */
export function parseRow(row: string[], mapping: CSVMapping): ParsedBodyMetric | null {
  if (mapping.dateColumn === undefined || mapping.weightColumn === undefined) {
    return null;
  }

  const dateStr = row[mapping.dateColumn];
  const weightStr = row[mapping.weightColumn];

  if (!dateStr || !weightStr) {
    return null;
  }

  const date = parseDate(dateStr, mapping.dateFormat);
  if (!date) {
    return null;
  }

  const weight = parseFloat(weightStr);
  if (isNaN(weight) || weight <= 0) {
    return null;
  }

  const result: ParsedBodyMetric = {
    date,
    weightKg: weight,
  };

  if (mapping.bodyFatColumn !== undefined && row[mapping.bodyFatColumn]) {
    const bodyFat = parseFloat(row[mapping.bodyFatColumn]);
    if (!isNaN(bodyFat) && bodyFat > 0 && bodyFat <= 100) {
      result.bodyFatPercent = bodyFat;
    }
  }

  if (mapping.muscleMassColumn !== undefined && row[mapping.muscleMassColumn]) {
    const muscleMass = parseFloat(row[mapping.muscleMassColumn]);
    if (!isNaN(muscleMass) && muscleMass > 0) {
      result.muscleMassKg = muscleMass;
    }
  }

  return result;
}

/**
 * Parse entire CSV file
 */
export function parseCSVFile(csvText: string, mapping: CSVMapping): ParsedBodyMetric[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) {
    return [];
  }

  // Skip header row
  const dataRows = rows.slice(1);
  const results: ParsedBodyMetric[] = [];

  dataRows.forEach(row => {
    const parsed = parseRow(row, mapping);
    if (parsed) {
      results.push(parsed);
    }
  });

  return results;
}
