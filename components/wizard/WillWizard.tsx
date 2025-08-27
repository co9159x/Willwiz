'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PersonalInfoStep, PersonalInfoData } from './PersonalInfoStep';
import { ExecutorsStep, Executor } from './ExecutorsStep';
import { BeneficiariesStep, Beneficiary } from './BeneficiariesStep';
import { GuardianshipStep, GuardianshipData } from './GuardianshipStep';
import { ResidueStep, ResidueData } from './ResidueStep';
import { ReviewStep } from './ReviewStep';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface WillData {
  personalInfo: {
    fullName: string;
    dateOfBirth: Date | null;
    address: {
      line1: string;
      line2: string;
      city: string;
      postcode: string;
      country: string;
    };
    maritalStatus: 'single' | 'married' | 'civil' | 'divorced' | 'widowed';
    nationality: string;
  };
  executors: Array<{
    id: string;
    fullName: string;
    relationship: string;
    address: string;
    isReserve: boolean;
  }>;
  beneficiaries: Array<{
    id: string;
    name: string;
    relationship: string;
    share: number;
    isCharity: boolean;
    charityNumber?: string;
  }>;
  guardianship: {
    hasMinorChildren: boolean;
    guardians: Array<{
      id: string;
      fullName: string;
      relationship: string;
      address: string;
    }>;
    specialInstructions: string;
  };
  residue: {
    distributionType: 'equal' | 'percentages' | 'custom';
    specificGifts: Array<{
      id: string;
      beneficiary: string;
      itemOrAmount: string;
      notes: string;
    }>;
    funeralWishes: string;
    specialClauses: string;
  };
}

interface WillWizardProps {
  clientId: string;
  willId?: string;
  initialData?: Partial<WillData>;
}

const STEPS = [
  { id: 'personal', title: 'Personal Information', description: 'Your basic details' },
  { id: 'executors', title: 'Executors', description: 'Who will carry out your will' },
  { id: 'beneficiaries', title: 'Beneficiaries', description: 'Who will receive your estate' },
  { id: 'guardianship', title: 'Guardianship', description: 'Care for minor children' },
  { id: 'residue', title: 'Residue & Gifts', description: 'Specific gifts and distribution' },
  { id: 'review', title: 'Review', description: 'Review and finalize' },
];

export function WillWizard({ clientId, willId, initialData }: WillWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [willData, setWillData] = useState<WillData>({
    personalInfo: {
      fullName: '',
      dateOfBirth: null,
      address: {
        line1: '',
        line2: '',
        city: '',
        postcode: '',
        country: 'UK',
      },
      maritalStatus: 'single',
      nationality: '',
    },
    executors: [],
    beneficiaries: [],
    guardianship: {
      hasMinorChildren: false,
      guardians: [],
      specialInstructions: '',
    },
    residue: {
      distributionType: 'equal',
      specificGifts: [],
      funeralWishes: '',
      specialClauses: '',
    },
    ...initialData,
  });

  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isSendingForApproval, setIsSendingForApproval] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (currentStep > 0) {
        saveWillData();
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [willData, currentStep]);

  const saveWillData = async () => {
    if (!willId) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/wills/${willId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonPayload: willData,
          version: 1, // This should be incremented on significant changes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save will data');
      }
    } catch (error) {
      console.error('Error saving will data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStepUpdate = (stepData: any) => {
    const stepKey = STEPS[currentStep].id as keyof WillData;
    setWillData(prev => ({
      ...prev,
      [stepKey]: stepData,
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGeneratePreview = async () => {
    setIsGeneratingPreview(true);
    try {
      const response = await fetch(`/api/wills/${willId}/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jsonPayload: willData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const { previewPdfUrl } = await response.json();
      
      // Open preview in new window
      window.open(previewPdfUrl, '_blank');
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleSendForApproval = async () => {
    setIsSendingForApproval(true);
    try {
      const response = await fetch(`/api/wills/${willId}/send_for_approval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send for approval');
      }

      // Redirect to client page or show success message
      router.push(`/clients/${clientId}`);
    } catch (error) {
      console.error('Error sending for approval:', error);
    } finally {
      setIsSendingForApproval(false);
    }
  };

  const renderCurrentStep = () => {
    const stepKey = STEPS[currentStep].id as keyof WillData;
    const stepData = willData[stepKey];

    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep
            data={stepData as PersonalInfoData}
            onUpdate={handleStepUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 1:
        return (
          <ExecutorsStep
            data={stepData as Executor[]}
            onUpdate={handleStepUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <BeneficiariesStep
            data={stepData as Beneficiary[]}
            onUpdate={handleStepUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <GuardianshipStep
            data={stepData as GuardianshipData}
            onUpdate={handleStepUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ResidueStep
            data={stepData as ResidueData}
            onUpdate={handleStepUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <ReviewStep
            data={willData}
            onBack={handleBack}
            onGeneratePreview={handleGeneratePreview}
            onSendForApproval={handleSendForApproval}
            isGeneratingPreview={isGeneratingPreview}
            isSendingForApproval={isSendingForApproval}
          />
        );
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="card-glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Will Creation Wizard</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
              </p>
            </div>
            {isSaving && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-slate-600">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    index <= currentStep ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'
                  }`}
                >
                  <Badge
                    variant={index <= currentStep ? 'default' : 'secondary'}
                    className="mb-1"
                  >
                    {index + 1}
                  </Badge>
                  <span className="text-xs text-center max-w-20">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      {renderCurrentStep()}
    </div>
  );
}
