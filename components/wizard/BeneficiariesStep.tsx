'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Users } from 'lucide-react';

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  share: number;
  isCharity: boolean;
  charityNumber?: string;
}

interface BeneficiariesStepProps {
  data: Beneficiary[];
  onUpdate: (data: Beneficiary[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BeneficiariesStep({ data, onUpdate, onNext, onBack }: BeneficiariesStepProps) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(data);

  const addBeneficiary = () => {
    const newBeneficiary: Beneficiary = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      share: 0,
      isCharity: false,
    };
    const updated = [...beneficiaries, newBeneficiary];
    setBeneficiaries(updated);
    onUpdate(updated);
  };

  const removeBeneficiary = (id: string) => {
    const updated = beneficiaries.filter(ben => ben.id !== id);
    setBeneficiaries(updated);
    onUpdate(updated);
  };

  const updateBeneficiary = (id: string, field: keyof Beneficiary, value: any) => {
    const updated = beneficiaries.map(ben => 
      ben.id === id ? { ...ben, [field]: value } : ben
    );
    setBeneficiaries(updated);
    onUpdate(updated);
  };

  const totalShare = beneficiaries.reduce((sum, ben) => sum + ben.share, 0);
  const isValid = beneficiaries.length > 0 && 
    beneficiaries.every(ben => ben.name.trim() && ben.share > 0) &&
    Math.abs(totalShare - 100) < 0.01; // Allow for floating point precision

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle>Beneficiaries</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Beneficiaries are the people or organizations who will receive your estate. The total percentage must equal 100%.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {beneficiaries.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No beneficiaries added yet. Click below to add your first beneficiary.
            </p>
            <Button onClick={addBeneficiary} className="button-base">
              <Plus className="mr-2 h-4 w-4" />
              Add Beneficiary
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {beneficiaries.map((beneficiary, index) => (
              <div key={beneficiary.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="default">
                    Beneficiary {index + 1}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeBeneficiary(beneficiary.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`charity-${beneficiary.id}`}
                      checked={beneficiary.isCharity}
                      onChange={(e) => updateBeneficiary(beneficiary.id, 'isCharity', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor={`charity-${beneficiary.id}`}>This is a charity</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${beneficiary.id}`}>
                        {beneficiary.isCharity ? 'Charity Name' : 'Full Name'} *
                      </Label>
                      <Input
                        id={`name-${beneficiary.id}`}
                        value={beneficiary.name}
                        onChange={(e) => updateBeneficiary(beneficiary.id, 'name', e.target.value)}
                        placeholder={beneficiary.isCharity ? "Enter charity name" : "Enter full name"}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`relationship-${beneficiary.id}`}>
                        {beneficiary.isCharity ? 'Charity Number' : 'Relationship'}
                      </Label>
                      <Input
                        id={`relationship-${beneficiary.id}`}
                        value={beneficiary.relationship}
                        onChange={(e) => updateBeneficiary(beneficiary.id, 'relationship', e.target.value)}
                        placeholder={beneficiary.isCharity ? "e.g., 123456" : "e.g., Spouse, Child, Friend"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`share-${beneficiary.id}`}>Percentage Share *</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id={`share-${beneficiary.id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={beneficiary.share}
                        onChange={(e) => updateBeneficiary(beneficiary.id, 'share', parseFloat(e.target.value) || 0)}
                        className="w-24"
                        required
                      />
                      <span className="text-sm text-slate-600">%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={addBeneficiary} variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Another Beneficiary
            </Button>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Share:</span>
                <Badge variant={Math.abs(totalShare - 100) < 0.01 ? "default" : "destructive"}>
                  {totalShare.toFixed(2)}%
                </Badge>
              </div>
              {Math.abs(totalShare - 100) >= 0.01 && (
                <p className="text-sm text-red-600 mt-1">
                  Total must equal 100%. Currently {totalShare.toFixed(2)}%
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            className="button-base" 
            onClick={onNext}
            disabled={!isValid}
          >
            Next: Guardianship
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
