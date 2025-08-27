'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Download, Send } from 'lucide-react';

interface WillData {
  personalInfo: any;
  executors: any[];
  beneficiaries: any[];
  guardianship: any;
  residue: any;
}

interface ReviewStepProps {
  data: WillData;
  onBack: () => void;
  onGeneratePreview: () => void;
  onSendForApproval: () => void;
  isGeneratingPreview: boolean;
  isSendingForApproval: boolean;
}

export function ReviewStep({ 
  data, 
  onBack, 
  onGeneratePreview, 
  onSendForApproval,
  isGeneratingPreview,
  isSendingForApproval
}: ReviewStepProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-GB');
  };

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle>Review Your Will</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Please review all the information before generating your will draft.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-3">
          <div 
            className="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => toggleSection('personal')}
          >
            <div className="flex items-center gap-2">
              <Badge variant="default">1</Badge>
              <span className="font-medium">Personal Information</span>
            </div>
            <Badge variant="outline">
              {activeSection === 'personal' ? 'Hide' : 'Show'}
            </Badge>
          </div>
          
          {activeSection === 'personal' && data.personalInfo && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
              <p><strong>Name:</strong> {data.personalInfo.fullName}</p>
              <p><strong>Date of Birth:</strong> {formatDate(data.personalInfo.dateOfBirth)}</p>
              <p><strong>Marital Status:</strong> {data.personalInfo.maritalStatus}</p>
              <p><strong>Nationality:</strong> {data.personalInfo.nationality || 'Not specified'}</p>
              <p><strong>Address:</strong></p>
              <div className="ml-4 space-y-1">
                <p>{data.personalInfo.address.line1}</p>
                {data.personalInfo.address.line2 && <p>{data.personalInfo.address.line2}</p>}
                <p>{data.personalInfo.address.city}, {data.personalInfo.address.postcode}</p>
                <p>{data.personalInfo.address.country}</p>
              </div>
            </div>
          )}
        </div>

        {/* Executors */}
        <div className="space-y-3">
          <div 
            className="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => toggleSection('executors')}
          >
            <div className="flex items-center gap-2">
              <Badge variant="default">2</Badge>
              <span className="font-medium">Executors ({data.executors?.length || 0})</span>
            </div>
            <Badge variant="outline">
              {activeSection === 'executors' ? 'Hide' : 'Show'}
            </Badge>
          </div>
          
          {activeSection === 'executors' && data.executors && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3">
              {data.executors.map((executor, index) => (
                <div key={executor.id} className="border rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={executor.isReserve ? "secondary" : "default"}>
                      {executor.isReserve ? "Reserve" : "Primary"}
                    </Badge>
                  </div>
                  <p><strong>Name:</strong> {executor.fullName}</p>
                  <p><strong>Relationship:</strong> {executor.relationship}</p>
                  <p><strong>Address:</strong> {executor.address}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Beneficiaries */}
        <div className="space-y-3">
          <div 
            className="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => toggleSection('beneficiaries')}
          >
            <div className="flex items-center gap-2">
              <Badge variant="default">3</Badge>
              <span className="font-medium">Beneficiaries ({data.beneficiaries?.length || 0})</span>
            </div>
            <Badge variant="outline">
              {activeSection === 'beneficiaries' ? 'Hide' : 'Show'}
            </Badge>
          </div>
          
          {activeSection === 'beneficiaries' && data.beneficiaries && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3">
              {data.beneficiaries.map((beneficiary, index) => (
                <div key={beneficiary.id} className="border rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={beneficiary.isCharity ? "secondary" : "default"}>
                      {beneficiary.isCharity ? "Charity" : "Individual"}
                    </Badge>
                  </div>
                  <p><strong>Name:</strong> {beneficiary.name}</p>
                  <p><strong>Relationship:</strong> {beneficiary.relationship || 'Not specified'}</p>
                  <p><strong>Share:</strong> {beneficiary.share}%</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guardianship */}
        {data.guardianship?.hasMinorChildren && (
          <div className="space-y-3">
            <div 
              className="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => toggleSection('guardianship')}
            >
              <div className="flex items-center gap-2">
                <Badge variant="default">4</Badge>
                <span className="font-medium">Guardianship ({data.guardianship.guardians?.length || 0})</span>
              </div>
              <Badge variant="outline">
                {activeSection === 'guardianship' ? 'Hide' : 'Show'}
              </Badge>
            </div>
            
            {activeSection === 'guardianship' && data.guardianship && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3">
                {data.guardianship.guardians.map((guardian: any, index: number) => (
                  <div key={guardian.id} className="border rounded p-3">
                    <p><strong>Name:</strong> {guardian.fullName}</p>
                    <p><strong>Relationship:</strong> {guardian.relationship || 'Not specified'}</p>
                    <p><strong>Address:</strong> {guardian.address}</p>
                  </div>
                ))}
                {data.guardianship.specialInstructions && (
                  <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-700 rounded">
                    <p><strong>Special Instructions:</strong></p>
                    <p className="mt-1">{data.guardianship.specialInstructions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Residue */}
        <div className="space-y-3">
          <div 
            className="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => toggleSection('residue')}
          >
            <div className="flex items-center gap-2">
              <Badge variant="default">5</Badge>
              <span className="font-medium">Residue & Specific Gifts</span>
            </div>
            <Badge variant="outline">
              {activeSection === 'residue' ? 'Hide' : 'Show'}
            </Badge>
          </div>
          
          {activeSection === 'residue' && data.residue && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3">
              <p><strong>Distribution Type:</strong> {data.residue.distributionType}</p>
              
              {data.residue.specificGifts && data.residue.specificGifts.length > 0 && (
                <div>
                  <p><strong>Specific Gifts:</strong></p>
                  {data.residue.specificGifts.map((gift: any, index: number) => (
                    <div key={gift.id} className="ml-4 mt-2 p-2 border rounded">
                      <p><strong>To:</strong> {gift.beneficiary}</p>
                      <p><strong>Item/Amount:</strong> {gift.itemOrAmount}</p>
                      {gift.notes && <p><strong>Notes:</strong> {gift.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
              
              {data.residue.funeralWishes && (
                <div>
                  <p><strong>Funeral Wishes:</strong></p>
                  <p className="ml-4 mt-1">{data.residue.funeralWishes}</p>
                </div>
              )}
              
              {data.residue.specialClauses && (
                <div>
                  <p><strong>Special Clauses:</strong></p>
                  <p className="ml-4 mt-1">{data.residue.specialClauses}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={onGeneratePreview}
              disabled={isGeneratingPreview}
              className="button-base"
            >
              <Eye className="mr-2 h-4 w-4" />
              {isGeneratingPreview ? 'Generating...' : 'Generate Preview'}
            </Button>
            <Button 
              onClick={onSendForApproval}
              disabled={isSendingForApproval}
              className="button-base"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSendingForApproval ? 'Sending...' : 'Send for Approval'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
