import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Loader2, Upload, CheckCircle2 } from 'lucide-react';

type Provider = 'inbody' | 'boditrax';
type Step = 'upload' | 'provider' | 'confirmation' | 'success';

interface ParsedData {
  measured_at?: string;
  weight_kg?: number;
  body_fat_percentage?: number;
  fat_mass_kg?: number;
  ffm_kg?: number;
  [key: string]: any;
}

export default function BodyReportImport() {
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('upload');
  const [provider, setProvider] = useState<Provider | ''>('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [storageKey, setStorageKey] = useState('');
  const [parsedData, setParsedData] = useState<ParsedData>({});
  const [templateName, setTemplateName] = useState('');
  const [saveTemplate, setSaveTemplate] = useState(false);

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

  // Queries
  const { data: lastTemplate } = trpc.bodyReport.getLastTemplate.useQuery(
    { provider: provider as Provider },
    { enabled: !!provider && step === 'provider' }
  );

  // Mutations
  const uploadMutation = trpc.bodyReport.uploadReportPhoto.useMutation();
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

        // Upload without provider yet - we'll select that next
        const result = await uploadMutation.mutateAsync({
          base64Data: base64,
          fileName: file.name,
          provider: 'inbody', // Temporary, will change on next step
          mimeType: file.type,
        });

        setPhotoUrl(result.photoUrl);
        setStorageKey(result.storageKey);
        setParsedData(result.parsedData || {});

        // Pre-fill form with parsed data
        if (result.parsedData) {
          if (result.parsedData.measured_at) setMeasured_at(String(result.parsedData.measured_at));
          if (result.parsedData.weight_kg) setWeight(String(result.parsedData.weight_kg));
          if (result.parsedData.body_fat_percentage) setBodyFat(String(result.parsedData.body_fat_percentage));
          if (result.parsedData.fat_mass_kg) setFatMass(String(result.parsedData.fat_mass_kg));
          if (result.parsedData.ffm_kg) setFfm(String(result.parsedData.ffm_kg));
        }

        setStep('provider');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
      setIsUploading(false);
    }
  };

  // Handle provider selection
  const handleProviderSelect = (selectedProvider: Provider) => {
    setProvider(selectedProvider);
    
    // Auto-apply last used template if available
    if (lastTemplate) {
      const fields = typeof lastTemplate.fieldsJson === 'string' 
        ? JSON.parse(lastTemplate.fieldsJson) 
        : lastTemplate.fieldsJson;
      
      if (fields.measured_at) setMeasured_at(String(fields.measured_at));
      if (fields.weight) setWeight(String(fields.weight));
      if (fields.bodyFat) setBodyFat(String(fields.bodyFat));
      if (fields.fatMass) setFatMass(String(fields.fatMass));
      if (fields.ffm) setFfm(String(fields.ffm));
    }

    setTimeout(() => setStep('confirmation'), 300);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!measured_at) newErrors.measured_at = 'Date is required';
    if (!weight) newErrors.weight = 'Weight is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!provider) {
      toast.error('Provider not selected');
      return;
    }

    setIsSaving(true);
    try {
      await saveMutation.mutateAsync({
        date: measured_at,
        weightKg: parseFloat(weight),
        bodyFatPercent: bodyFat ? parseFloat(bodyFat) : undefined,
        fatMassKg: fatMass ? parseFloat(fatMass) : undefined,
        ffmKg: ffm ? parseFloat(ffm) : undefined,
        note: note || undefined,
        photoUrl,
        storageKey,
        provider,
        saveTemplate,
        templateName: saveTemplate ? templateName : undefined,
        templateFields: saveTemplate
          ? {
              measured_at,
              weight,
              bodyFat,
              fatMass,
              ffm,
            }
          : undefined,
      });

      toast.success('Body metrics imported successfully');

      setStep('success');
      setTimeout(() => navigate('/body'), 2000);
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Upload Step
  if (step === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardHeader>
              <CardTitle>Import Body Report</CardTitle>
              <CardDescription>Upload a photo of your InBody or Boditrax report</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
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
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate('/body')}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Provider Selection Step
  if (step === 'provider') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardHeader>
              <CardTitle>Select Provider</CardTitle>
              <CardDescription>Which device was used to measure?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleProviderSelect('inbody')}
                variant={provider === 'inbody' ? 'default' : 'outline'}
                className="w-full h-12"
                disabled={isUploading}
              >
                InBody
              </Button>
              <Button
                onClick={() => handleProviderSelect('boditrax')}
                variant={provider === 'boditrax' ? 'default' : 'outline'}
                className="w-full h-12"
                disabled={isUploading}
              >
                Boditrax
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep('upload');
                  setProvider('');
                  setPhotoUrl('');
                  setStorageKey('');
                }}
              >
                Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Confirmation Step
  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Import</CardTitle>
              <CardDescription>Review and edit the extracted data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo Preview */}
              {photoUrl && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img src={photoUrl} alt="Report" className="w-full h-64 object-cover" />
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Date */}
                <div>
                  <Label htmlFor="measured_at">Date *</Label>
                  <Input
                    id="measured_at"
                    type="date"
                    value={measured_at}
                    onChange={(e) => {
                      setMeasured_at(e.target.value);
                      if (errors.measured_at) setErrors({ ...errors, measured_at: '' });
                    }}
                    className={errors.measured_at ? 'border-red-500' : ''}
                  />
                  {errors.measured_at && <p className="text-sm text-red-500 mt-1">{errors.measured_at}</p>}
                </div>

                {/* Weight */}
                <div>
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => {
                      setWeight(e.target.value);
                      if (errors.weight) setErrors({ ...errors, weight: '' });
                    }}
                    className={errors.weight ? 'border-red-500' : ''}
                  />
                  {errors.weight && <p className="text-sm text-red-500 mt-1">{errors.weight}</p>}
                </div>

                {/* Body Fat */}
                <div>
                  <Label htmlFor="bodyFat">Body Fat (%)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                  />
                </div>

                {/* Fat Mass */}
                <div>
                  <Label htmlFor="fatMass">Fat Mass (kg)</Label>
                  <Input
                    id="fatMass"
                    type="number"
                    step="0.1"
                    value={fatMass}
                    onChange={(e) => setFatMass(e.target.value)}
                  />
                </div>

                {/* Lean Mass */}
                <div>
                  <Label htmlFor="ffm">Lean Mass (kg)</Label>
                  <Input
                    id="ffm"
                    type="number"
                    step="0.1"
                    value={ffm}
                    onChange={(e) => setFfm(e.target.value)}
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="note">Notes</Label>
                  <Input
                    id="note"
                    type="text"
                    placeholder="Optional notes about this measurement"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                {/* Save Template */}
                <div className="flex items-center space-x-2">
                  <input
                    id="saveTemplate"
                    type="checkbox"
                    checked={saveTemplate}
                    onChange={(e) => setSaveTemplate(e.target.checked)}
                  />
                  <Label htmlFor="saveTemplate" className="cursor-pointer">Save as template for future imports</Label>
                </div>

                {/* Template Name */}
                {saveTemplate && (
                  <div>
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input
                      id="templateName"
                      type="text"
                      placeholder="e.g., My Standard Template"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('provider');
                    setProvider('');
                  }}
                  disabled={isSaving}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Import
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success Step
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-2">Import Successful!</h2>
            <p className="text-muted-foreground mb-4">Your body metrics have been saved.</p>
            <p className="text-sm text-muted-foreground">Redirecting to body page...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
