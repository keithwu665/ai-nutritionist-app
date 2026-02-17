/**
 * Body Report Parser Provider
 * Extensible interface for parsing body composition reports from photos
 * MVP: Returns empty/null values, ready for future OCR integration
 */

export interface ParsedBodyReport {
  weightKg?: number;
  bodyFatPercent?: number;
  muscleMassKg?: number;
  ffmKg?: number; // Fat-free mass
  bmr?: number;
  tdee?: number;
  measurementDate?: string;
  confidence?: number; // 0-1 confidence score
}

export type BodyReportProvider = "inbody" | "boditrax" | "other";

export interface BodyReportParserProvider {
  provider: BodyReportProvider;
  parse(imageUrl: string): Promise<ParsedBodyReport>;
  name: string;
  description: string;
}

/**
 * InBody Parser Provider (MVP - returns empty)
 */
export const inbodyParser: BodyReportParserProvider = {
  provider: "inbody",
  name: "InBody",
  description: "InBody body composition analyzer",
  async parse(imageUrl: string): Promise<ParsedBodyReport> {
    // MVP: Return empty object
    // Future: Implement OCR to extract InBody report data
    return {};
  },
};

/**
 * Boditrax Parser Provider (MVP - returns empty)
 */
export const boditraxParser: BodyReportParserProvider = {
  provider: "boditrax",
  name: "Boditrax",
  description: "Boditrax body composition scale",
  async parse(imageUrl: string): Promise<ParsedBodyReport> {
    // MVP: Return empty object
    // Future: Implement OCR to extract Boditrax report data
    return {};
  },
};

/**
 * Generic Parser Provider (MVP - returns empty)
 */
export const genericParser: BodyReportParserProvider = {
  provider: "other",
  name: "Other",
  description: "Generic body composition report",
  async parse(imageUrl: string): Promise<ParsedBodyReport> {
    // MVP: Return empty object
    // Future: Implement generic OCR
    return {};
  },
};

/**
 * Get parser by provider type
 */
export function getParser(provider: BodyReportProvider): BodyReportParserProvider {
  switch (provider) {
    case "inbody":
      return inbodyParser;
    case "boditrax":
      return boditraxParser;
    case "other":
      return genericParser;
    default:
      return genericParser;
  }
}

/**
 * Parse body report from image
 * MVP: Returns empty, allows manual data entry
 */
export async function parseBodyReport(
  imageUrl: string,
  provider: BodyReportProvider
): Promise<ParsedBodyReport> {
  const parser = getParser(provider);
  try {
    return await parser.parse(imageUrl);
  } catch (error) {
    console.error(`Failed to parse ${provider} report:`, error);
    return {};
  }
}
