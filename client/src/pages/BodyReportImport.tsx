import React, { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Loader2, Upload, CheckCircle2 } from 'lucide-react';
import BackButton from '@/components/BackButton';

type Provider = 'inbody' | 'boditrax';
type Step = 'upload' | 'roi-select' | 'provider' | 'confirmation' | 'success';

interface ParsedData {
  measured_at?: string;
  weight_kg?: number;
  body_fat_percent?: number;
  fat_mass_kg?: number;
  ffm_kg?: number;
  confidence?: {
    measured_at?: number;
    weight_kg?: number;
    body_fat_percent?: number;
    fat_mass_kg?: number;
    ffm_kg?: number;
  };
  [key: string]: any;
}

interface ROISelection {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function BodyReportImport() {
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [step, setStep] = useState<Step>('upload');
  const [provider, setProvider] = useState<Provider | ''>('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [storageKey, setStorageKey] = useState('');
  const [parsedData, setParsedData] = useState<ParsedData>({});
  const [templateName, setTemplateName] = useState('');
  const [saveTemplate, setSaveTemplate] = useState(false);
  const [roiSelection, setRoiSelection] = useState<ROISelection | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Form data
  const [measured_at, setMeasured_at] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [fatMass, setFatMass] = useState('');
  const [ffm, setFfm] = useState('');
  const [note, setNote] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // Queries
  const { data: lastTemplate } = trpc.bodyReport.getLastTemplate.useQuery(
    { provider: provider as Provider },
    { enabled: !!provider && step === 'provider' }
  );

  // Mutations
  const uploadMutation = trpc.bodyReport.uploadReportPhoto.useMutation();
  const extractMutation = trpc.bodyReport.extractMetricsFromROI.useMutation();
  const saveMutation = trpc.bodyReport.saveImport.useMutation();

  // Handle file upload
  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        if (!base64) {
          toast.error('Failed to read file');
          setIsUploading(false);
          return;
        }

        const result = await uploadMutation.mutateAsync({
          base64Data: base64,
          fileName: file.name,
          provider: 'inbody',
          mimeType: file.type,
        });

        setPhotoUrl(result.photoUrl);
        setStorageKey(result.storageKey);
        setStep('roi-select');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload photo');
      setIsUploading(false);
    }
  };

  // Handle ROI selection on canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setStartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Redraw image
    const img = new Image();
    img.src = photoUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Draw selection rectangle
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        startPos.x,
        startPos.y,
        currentX - startPos.x,
        currentY - startPos.y
      );
    };
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const width = Math.abs(endX - startPos.x);
    const height = Math.abs(endY - startPos.y);

    if (width > 50 && height > 50) {
      setRoiSelection({
        x: Math.min(startPos.x, endX),
        y: Math.min(startPos.y, endY),
        width,
        height,
      });
    }

    setIsDrawing(false);
  };

  // Extract metrics from ROI using Vision LLM
  const handleExtractMetrics = async () => {
    if (!roiSelection || !provider) {
      toast.error('Please select a region and provider');
      return;
    }

    setIsExtracting(true);
    try {
      const result = await extractMutation.mutateAsync({
        photoUrl,
        provider: provider as Provider,
        roiSelection,
      });

      setParsedData(result);

      // Pre-fill form with extracted data
      if (result.fields) {
        if (result.fields.measured_at) setMeasured_at(result.fields.measured_at);
        if (result.fields.weight_kg) setWeight(String(result.fields.weight_kg));
        if (result.fields.body_fat_percent) setBodyFat(String(result.fields.body_fat_percent));
        if (result.fields.fat_mass_kg) setFatMass(String(result.fields.fat_mass_kg));
        if (result.fields.ffm_kg) setFfm(String(result.fields.ffm_kg));
      }

      toast.success('Metrics extracted successfully');
      setStep('confirmation');
    } catch (error) {
      toast.error('Failed to extract metrics');
      console.error(error);
    } finally {
      setIsExtracting(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!measured_at) newErrors.measured_at = 'Date is required';
    if (!weight) newErrors.weight = 'Weight is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSaving(true);
    try {
      await saveMutation.mutateAsync({
        date: measured_at,
        weightKg: parseFloat(weight),
        bodyFatPercent: bodyFat ? parseFloat(bodyFat) : undefined,
        fatMassKg: fatMass ? parseFloat(fatMass) : undefined,
        muscleMassKg: undefined,
        ffmKg: ffm ? parseFloat(ffm) : undefined,
        note,
        photoUrl,
        storageKey,
        provider: provider as Provider,
        saveTemplate,
        templateName,
        templateFields: parsedData,
      });

      toast.success('Import saved successfully');
      setStep('success');
      setTimeout(() => {
        navigate('/body');
      }, 2000);
    } catch (error) {
      toast.error('Failed to save import');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Render steps
  if (step === 'upload') {
    return (
      <div className="container max-w-2xl py-8 space-y-4">
        <BackButton label="返回" />
        <Card>
          <CardHeader>
            <CardTitle>Import Body Report</CardTitle>
            <CardDescription>Upload a photo of your InBody or Boditrax report</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'roi-select') {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Data Region</CardTitle>
            <CardDescription>Draw a box around the metrics area you want to extract</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full cursor-crosshair bg-gray-100"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onLoad={() => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const ctx = canvas.getContext('2d');
                  const img = new Image();
                  img.src = photoUrl;
                  img.onload = () => {
                    ctx?.drawImage(img, 0, 0);
                  };
                }}
              />
            </div>

            {roiSelection && (
              <div className="text-sm text-green-600">
                ✓ Region selected ({roiSelection.width}x{roiSelection.height}px)
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep('upload');
                  setPhotoUrl('');
                  setRoiSelection(null);
                }}
              >
                Back
              </Button>
              <Button
                onClick={() => setStep('provider')}
                disabled={!roiSelection || isExtracting}
              >
                {isExtracting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Next: Select Provider
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'provider') {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Device</CardTitle>
            <CardDescription>Which device was used to measure?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={provider === 'inbody' ? 'default' : 'outline'}
                onClick={() => setProvider('inbody')}
                className="h-20"
              >
                InBody
              </Button>
              <Button
                variant={provider === 'boditrax' ? 'default' : 'outline'}
                onClick={() => setProvider('boditrax')}
                className="h-20"
              >
                Boditrax
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('roi-select')}
              >
                Back
              </Button>
              <Button
                onClick={handleExtractMetrics}
                disabled={!provider || isExtracting}
              >
                {isExtracting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Extract Metrics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'confirmation') {
    const getConfidenceLevel = (confidence?: number) => {
      if (!confidence) return 'low';
      if (confidence >= 0.8) return 'high';
      if (confidence >= 0.5) return 'medium';
      return 'low';
    };

    const getConfidenceColor = (level: string) => {
      switch (level) {
        case 'high':
          return 'text-green-600';
        case 'medium':
          return 'text-yellow-600';
        default:
          return 'text-red-600';
      }
    };

    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Review & Edit</CardTitle>
            <CardDescription>Verify and edit the extracted metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Photo preview */}
            <div className="border rounded-lg overflow-hidden">
              <img src={photoUrl} alt="Report" className="w-full h-auto" />
            </div>

            {/* Form fields with confidence indicators */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="measured_at">
                  Date *
                  {parsedData.confidence?.measured_at && (
                    <span className={`ml-2 text-xs ${getConfidenceColor(getConfidenceLevel(parsedData.confidence.measured_at))}`}>
                      ({getConfidenceLevel(parsedData.confidence.measured_at)})
                    </span>
                  )}
                </Label>
                <Input
                  id="measured_at"
                  type="date"
                  value={measured_at}
                  onChange={(e) => setMeasured_at(e.target.value)}
                  className={errors.measured_at ? 'border-red-500' : ''}
                />
                {errors.measured_at && <p className="text-xs text-red-500 mt-1">{errors.measured_at}</p>}
              </div>

              <div>
                <Label htmlFor="weight">
                  Weight (kg) *
                  {parsedData.confidence?.weight_kg && (
                    <span className={`ml-2 text-xs ${getConfidenceColor(getConfidenceLevel(parsedData.confidence.weight_kg))}`}>
                      ({getConfidenceLevel(parsedData.confidence.weight_kg)})
                    </span>
                  )}
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={errors.weight ? 'border-red-500' : ''}
                />
                {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight}</p>}
              </div>

              <div>
                <Label htmlFor="bodyFat">
                  Body Fat (%)
                  {parsedData.confidence?.body_fat_percent && (
                    <span className={`ml-2 text-xs ${getConfidenceColor(getConfidenceLevel(parsedData.confidence.body_fat_percent))}`}>
                      ({getConfidenceLevel(parsedData.confidence.body_fat_percent)})
                    </span>
                  )}
                </Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="fatMass">
                  Fat Mass (kg)
                  {parsedData.confidence?.fat_mass_kg && (
                    <span className={`ml-2 text-xs ${getConfidenceColor(getConfidenceLevel(parsedData.confidence.fat_mass_kg))}`}>
                      ({getConfidenceLevel(parsedData.confidence.fat_mass_kg)})
                    </span>
                  )}
                </Label>
                <Input
                  id="fatMass"
                  type="number"
                  step="0.1"
                  value={fatMass}
                  onChange={(e) => setFatMass(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="ffm">
                  Lean Mass (kg)
                  {parsedData.confidence?.ffm_kg && (
                    <span className={`ml-2 text-xs ${getConfidenceColor(getConfidenceLevel(parsedData.confidence.ffm_kg))}`}>
                      ({getConfidenceLevel(parsedData.confidence.ffm_kg)})
                    </span>
                  )}
                </Label>
                <Input
                  id="ffm"
                  type="number"
                  step="0.1"
                  value={ffm}
                  onChange={(e) => setFfm(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="note">Notes (optional)</Label>
                <Input
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add any notes about this measurement"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveTemplate"
                  checked={saveTemplate}
                  onChange={(e) => setSaveTemplate(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="saveTemplate" className="cursor-pointer">
                  Save as template for future imports
                </Label>
              </div>

              {saveTemplate && (
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name (e.g., 'My InBody Setup')"
                />
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('provider')}
              >
                Back
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Import
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardContent className="pt-8">
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-600" />
              <h2 className="text-2xl font-bold">Import Successful!</h2>
              <p className="text-muted-foreground">Your body metrics have been saved and will appear in your dashboard.</p>
              <Button onClick={() => navigate('/body')}>
                View Body Metrics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
