/**
 * BodyReportParserProvider Interface
 * Extensible architecture for parsing body composition reports from different providers
 */

export interface ParsedBodyData {
  weight?: number;
  bodyFatPercent?: number;
  muscleMassKg?: number;
  fatMassKg?: number;
  ffmKg?: number;
  bmi?: number;
  bmr?: number;
  water?: number;
  [key: string]: number | string | undefined;
}

export interface BodyReportParserProvider {
  provider: 'inbody' | 'boditrax' | 'other';
  parse(imageUrl: string, templateFields?: Record<string, string>): Promise<ParsedBodyData | null>;
  canParse(provider: string): boolean;
}

/**
 * InBody Parser Implementation
 * Parses InBody composition analysis reports
 */
export class InBodyParser implements BodyReportParserProvider {
  provider: 'inbody' = 'inbody';

  canParse(provider: string): boolean {
    return provider === 'inbody';
  }

  async parse(imageUrl: string, templateFields?: Record<string, string>): Promise<ParsedBodyData | null> {
    try {
      // In a real implementation, this would use OCR or AI vision to extract data
      // For now, return empty result to allow manual override
      console.log(`[InBodyParser] Attempting to parse: ${imageUrl}`);
      return null; // Allow manual override
    } catch (error) {
      console.error(`[InBodyParser] Error parsing image:`, error);
      return null;
    }
  }
}

/**
 * Boditrax Parser Implementation
 * Parses Boditrax composition analysis reports
 */
export class BoditraxParser implements BodyReportParserProvider {
  provider: 'boditrax' = 'boditrax';

  canParse(provider: string): boolean {
    return provider === 'boditrax';
  }

  async parse(imageUrl: string, templateFields?: Record<string, string>): Promise<ParsedBodyData | null> {
    try {
      // In a real implementation, this would use OCR or AI vision to extract data
      // For now, return empty result to allow manual override
      console.log(`[BoditraxParser] Attempting to parse: ${imageUrl}`);
      return null; // Allow manual override
    } catch (error) {
      console.error(`[BoditraxParser] Error parsing image:`, error);
      return null;
    }
  }
}

/**
 * Parser Registry
 * Manages available parsers and routes to appropriate parser
 */
export class BodyReportParserRegistry {
  private parsers: Map<string, BodyReportParserProvider> = new Map();

  constructor() {
    this.register(new InBodyParser());
    this.register(new BoditraxParser());
  }

  register(parser: BodyReportParserProvider): void {
    this.parsers.set(parser.provider, parser);
  }

  async parse(provider: string, imageUrl: string, templateFields?: Record<string, string>): Promise<ParsedBodyData | null> {
    const parser = this.parsers.get(provider);
    if (!parser) {
      console.warn(`[ParserRegistry] No parser found for provider: ${provider}`);
      return null;
    }
    return parser.parse(imageUrl, templateFields);
  }

  getParser(provider: string): BodyReportParserProvider | undefined {
    return this.parsers.get(provider);
  }
}

// Global registry instance
export const bodyReportParserRegistry = new BodyReportParserRegistry();
