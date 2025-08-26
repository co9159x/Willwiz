'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save, Eye, Send } from 'lucide-react';

interface WillData {
  id: string;
  clientId: string;
  status: string;
  jsonPayload: any;
  draftMarkdown?: string;
  client: {
    firstName: string;
    lastName: string;
  };
}

const steps = [
  { id: 1, title: 'Personal Information', description: 'Basic details about the testator' },
  { id: 2, title: 'Executors', description: 'Who will execute the will' },
  { id: 3, title: 'Beneficiaries', description: 'Who will inherit' },
  { id: 4, title: 'Guardianship', description: 'Guardians for minor children' },
  { id: 5, title: 'Residue', description: 'Residual estate distribution' },
  { id: 6, title: 'Review', description: 'Review and finalize' },
];

export default function WillWizardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [will, setWill] = useState<WillData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWill();
  }, []);

  const fetchWill = async () => {
    try {
      const response = await fetch(`/api/wills/${params.id}`);
      if (response.ok) {
        const willData = await response.json();
        setWill(willData);
        setFormData(willData.jsonPayload || {});
      }
    } catch (error) {
      console.error('Error fetching will:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWill = async (autoSave = false) => {
    if (!will) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/wills/${will.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonPayload: formData,
          draftMarkdown: generateMarkdown(),
        }),
      });

      if (response.ok) {
        if (!autoSave) {
          // Show success message or toast
        }
      }
    } catch (error) {
      console.error('Error saving will:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateMarkdown = () => {
    // Simple markdown generation based on form data
    let markdown = `# Will of ${will?.client.firstName} ${will?.client.lastName}\n\n`;
    
    if (formData.personalInfo) {
      markdown += `## Personal Information\n`;
      markdown += `- Name: ${formData.personalInfo.fullName || ''}\n`;
      markdown += `- Address: ${formData.personalInfo.address || ''}\n\n`;
    }

    if (formData.executors) {
      markdown += `## Executors\n`;
      formData.executors.forEach((executor: any, index: number) => {
        markdown += `${index + 1}. ${executor.name} - ${executor.relationship}\n`;
      });
      markdown += '\n';
    }

    if (formData.beneficiaries) {
      markdown += `## Beneficiaries\n`;
      formData.beneficiaries.forEach((beneficiary: any, index: number) => {
        markdown += `${index + 1}. ${beneficiary.name} - ${beneficiary.relationship} - ${beneficiary.share}\n`;
      });
      markdown += '\n';
    }

    return markdown;
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      saveWill(true); // Auto-save
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGeneratePreview = async () => {
    await saveWill();
    try {
      const response = await fetch(`/api/wills/${will?.id}/preview`, {
        method: 'POST',
      });
      if (response.ok) {
        const { previewPdfUrl } = await response.json();
        window.open(previewPdfUrl, '_blank');
      }
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  const handleSendForApproval = async () => {
    await saveWill();
    try {
      const response = await fetch(`/api/wills/${will?.id}/send_for_approval`, {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error sending for approval:', error);
    }
  };

  const updateFormData = (section: string, data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: data,
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!will) {
    return (
      <div className="container mx-auto p-6">
        <Card className="card-glass">
          <CardContent className="pt-6">
            <p>Will not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Will Wizard</h1>
          <Badge variant={will.status === 'draft' ? 'secondary' : 'default'}>
            {will.status}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Creating will for {will.client.firstName} {will.client.lastName}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Progress Sidebar */}
        <div className="lg:col-span-1">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(currentStep / steps.length) * 100} className="mb-4" />
              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentStep === step.id
                        ? 'bg-primary text-primary-foreground'
                        : currentStep > step.id
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-xs font-medium">
                        {step.id}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs opacity-75">{step.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step Content */}
              {currentStep === 1 && (
                <PersonalInfoStep
                  data={formData.personalInfo || {}}
                  onChange={(data) => updateFormData('personalInfo', data)}
                />
              )}
              {currentStep === 2 && (
                <ExecutorsStep
                  data={formData.executors || []}
                  onChange={(data) => updateFormData('executors', data)}
                />
              )}
              {currentStep === 3 && (
                <BeneficiariesStep
                  data={formData.beneficiaries || []}
                  onChange={(data) => updateFormData('beneficiaries', data)}
                />
              )}
              {currentStep === 4 && (
                <GuardianshipStep
                  data={formData.guardianship || {}}
                  onChange={(data) => updateFormData('guardianship', data)}
                />
              )}
              {currentStep === 5 && (
                <ResidueStep
                  data={formData.residue || {}}
                  onChange={(data) => updateFormData('residue', data)}
                />
              )}
              {currentStep === 6 && (
                <ReviewStep
                  data={formData}
                  onGeneratePreview={handleGeneratePreview}
                  onSendForApproval={handleSendForApproval}
                />
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => saveWill()}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>

                  {currentStep < steps.length ? (
                    <Button onClick={handleNext} className="button-base">
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleGeneratePreview} className="button-base">
                      <Eye className="h-4 w-4 mr-2" />
                      Generate Preview
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Step Components
function PersonalInfoStep({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={data.fullName || ''}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth || ''}
            onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={data.address || ''}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
        />
      </div>
    </div>
  );
}

function ExecutorsStep({ data, onChange }: { data: any[]; onChange: (data: any[]) => void }) {
  const addExecutor = () => {
    onChange([...data, { name: '', relationship: '' }]);
  };

  const updateExecutor = (index: number, field: string, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const removeExecutor = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {data.map((executor, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={executor.name || ''}
                onChange={(e) => updateExecutor(index, 'name', e.target.value)}
              />
            </div>
            <div>
              <Label>Relationship</Label>
              <Input
                value={executor.relationship || ''}
                onChange={(e) => updateExecutor(index, 'relationship', e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => removeExecutor(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addExecutor}>
        Add Executor
      </Button>
    </div>
  );
}

function BeneficiariesStep({ data, onChange }: { data: any[]; onChange: (data: any[]) => void }) {
  const addBeneficiary = () => {
    onChange([...data, { name: '', relationship: '', share: '' }]);
  };

  const updateBeneficiary = (index: number, field: string, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const removeBeneficiary = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {data.map((beneficiary, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={beneficiary.name || ''}
                onChange={(e) => updateBeneficiary(index, 'name', e.target.value)}
              />
            </div>
            <div>
              <Label>Relationship</Label>
              <Input
                value={beneficiary.relationship || ''}
                onChange={(e) => updateBeneficiary(index, 'relationship', e.target.value)}
              />
            </div>
            <div>
              <Label>Share</Label>
              <Input
                value={beneficiary.share || ''}
                onChange={(e) => updateBeneficiary(index, 'share', e.target.value)}
                placeholder="e.g., 50%"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => removeBeneficiary(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addBeneficiary}>
        Add Beneficiary
      </Button>
    </div>
  );
}

function GuardianshipStep({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="guardianName">Guardian Name</Label>
        <Input
          id="guardianName"
          value={data.guardianName || ''}
          onChange={(e) => onChange({ ...data, guardianName: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="guardianRelationship">Relationship to Children</Label>
        <Input
          id="guardianRelationship"
          value={data.guardianRelationship || ''}
          onChange={(e) => onChange({ ...data, guardianRelationship: e.target.value })}
        />
      </div>
    </div>
  );
}

function ResidueStep({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="residuaryBeneficiary">Residuary Beneficiary</Label>
        <Input
          id="residuaryBeneficiary"
          value={data.residuaryBeneficiary || ''}
          onChange={(e) => onChange({ ...data, residuaryBeneficiary: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="residuaryInstructions">Special Instructions</Label>
        <Textarea
          id="residuaryInstructions"
          value={data.residuaryInstructions || ''}
          onChange={(e) => onChange({ ...data, residuaryInstructions: e.target.value })}
        />
      </div>
    </div>
  );
}

function ReviewStep({ 
  data, 
  onGeneratePreview, 
  onSendForApproval 
}: { 
  data: any; 
  onGeneratePreview: () => void;
  onSendForApproval: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {data.personalInfo?.fullName || 'Not provided'}</p>
            <p><strong>Address:</strong> {data.personalInfo?.address || 'Not provided'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Executors ({data.executors?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {data.executors?.map((executor: any, index: number) => (
              <p key={index}>{executor.name} - {executor.relationship}</p>
            )) || 'No executors specified'}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beneficiaries ({data.beneficiaries?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {data.beneficiaries?.map((beneficiary: any, index: number) => (
              <p key={index}>{beneficiary.name} - {beneficiary.relationship} - {beneficiary.share}</p>
            )) || 'No beneficiaries specified'}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button onClick={onGeneratePreview} className="button-base">
          <Eye className="h-4 w-4 mr-2" />
          Generate Preview
        </Button>
        <Button onClick={onSendForApproval} className="button-base">
          <Send className="h-4 w-4 mr-2" />
          Send for Approval
        </Button>
      </div>
    </div>
  );
}
