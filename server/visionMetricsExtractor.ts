import { invokeLLM } from './_core/llm';

export interface ExtractionResult {
  fields: {
    measured_at: string | null;
    weight_kg: number | null;
    body_fat_percent: number | null;
    fat_mass_kg: number | null;
    ffm_kg: number | null;
    lean_mass_kg: number | null;
  };
  confidence: {
    measured_at: number;
    weight_kg: number;
    body_fat_percent: number;
    fat_mass_kg: number;
    ffm_kg: number;
    lean_mass_kg: number;
  };
  raw: any;
}

const INBODY_PROMPT = `You are analyzing a cropped region from an InBody body composition report.
Extract these metrics: Weight (kg), Body Fat %, Fat Mass (kg), FFM (kg), Lean Mass (kg), Date.
Rules: Return ONLY valid JSON. If not visible, return null. Confidence 0.0-1.0.
Return: {"measured_at":"YYYY-MM-DD or null","measured_at_confidence":0,"weight_kg":null,"weight_kg_confidence":0,"body_fat_percent":null,"body_fat_percent_confidence":0,"fat_mass_kg":null,"fat_mass_kg_confidence":0,"ffm_kg":null,"ffm_kg_confidence":0,"lean_mass_kg":null,"lean_mass_kg_confidence":0}`;

const BODITRAX_PROMPT = `You are analyzing a cropped region from a Boditrax body composition report.
Extract these metrics: Weight (kg), Body Fat %, Fat Mass (kg), FFM (kg), Lean Mass (kg), Date.
Rules: Return ONLY valid JSON. If not visible, return null. Confidence 0.0-1.0.
Return: {"measured_at":"YYYY-MM-DD or null","measured_at_confidence":0,"weight_kg":null,"weight_kg_confidence":0,"body_fat_percent":null,"body_fat_percent_confidence":0,"fat_mass_kg":null,"fat_mass_kg_confidence":0,"ffm_kg":null,"ffm_kg_confidence":0,"lean_mass_kg":null,"lean_mass_kg_confidence":0}`;

export async function extractMetricsFromReportVision(
  provider: 'inbody' | 'boditrax',
  roiPhotoUrl: string
): Promise<ExtractionResult> {
  try {
    console.log(`[VisionExtractor] Extracting metrics from ${provider} ROI`);

    const prompt = provider === 'inbody' ? INBODY_PROMPT : BODITRAX_PROMPT;

    const response = await invokeLLM({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: roiPhotoUrl,
                detail: 'high',
              },
            },
          ],
        },
      ],
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      console.error('[VisionExtractor] Empty response from LLM');
      return createEmptyResult();
    }

    const responseText = typeof responseContent === 'string' ? responseContent : JSON.stringify(responseContent);
    console.log('[VisionExtractor] Raw LLM response:', responseText);

    let parsed;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[VisionExtractor] No JSON found in response');
        return createEmptyResult();
      }
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[VisionExtractor] Failed to parse JSON:', parseError);
      return createEmptyResult();
    }

    const result: ExtractionResult = {
      fields: {
        measured_at: parsed.measured_at || null,
        weight_kg: parsed.weight_kg ? parseFloat(parsed.weight_kg) : null,
        body_fat_percent: parsed.body_fat_percent ? parseFloat(parsed.body_fat_percent) : null,
        fat_mass_kg: parsed.fat_mass_kg ? parseFloat(parsed.fat_mass_kg) : null,
        ffm_kg: parsed.ffm_kg ? parseFloat(parsed.ffm_kg) : null,
        lean_mass_kg: parsed.lean_mass_kg ? parseFloat(parsed.lean_mass_kg) : null,
      },
      confidence: {
        measured_at: parsed.measured_at_confidence || 0,
        weight_kg: parsed.weight_kg_confidence || 0,
        body_fat_percent: parsed.body_fat_percent_confidence || 0,
        fat_mass_kg: parsed.fat_mass_kg_confidence || 0,
        ffm_kg: parsed.ffm_kg_confidence || 0,
        lean_mass_kg: parsed.lean_mass_kg_confidence || 0,
      },
      raw: parsed,
    };

    console.log('[VisionExtractor] Extraction complete');
    return result;
  } catch (error) {
    console.error('[VisionExtractor] Error:', error);
    return createEmptyResult();
  }
}

function createEmptyResult(): ExtractionResult {
  return {
    fields: {
      measured_at: null,
      weight_kg: null,
      body_fat_percent: null,
      fat_mass_kg: null,
      ffm_kg: null,
      lean_mass_kg: null,
    },
    confidence: {
      measured_at: 0,
      weight_kg: 0,
      body_fat_percent: 0,
      fat_mass_kg: 0,
      ffm_kg: 0,
      lean_mass_kg: 0,
    },
    raw: null,
  };
}
