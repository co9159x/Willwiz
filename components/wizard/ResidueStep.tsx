'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Gift } from 'lucide-react';

interface SpecificGift {
  id: string;
  beneficiary: string;
  itemOrAmount: string;
  notes: string;
}

interface ResidueData {
  distributionType: 'equal' | 'percentages' | 'custom';
  specificGifts: SpecificGift[];
  funeralWishes: string;
  specialClauses: string;
}

interface ResidueStepProps {
  data: ResidueData;
  onUpdate: (data: ResidueData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ResidueStep({ data, onUpdate, onNext, onBack }: ResidueStepProps) {
  const [formData, setFormData] = useState<ResidueData>(data);

  const addSpecificGift = () => {
    const newGift: SpecificGift = {
      id: Date.now().toString(),
      beneficiary: '',
      itemOrAmount: '',
      notes: '',
    };
    const updated = { ...formData, specificGifts: [...formData.specificGifts, newGift] };
    setFormData(updated);
    onUpdate(updated);
  };

  const removeSpecificGift = (id: string) => {
    const updated = { 
      ...formData, 
      specificGifts: formData.specificGifts.filter(gift => gift.id !== id) 
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const updateSpecificGift = (id: string, field: keyof SpecificGift, value: string) => {
    const updated = {
      ...formData,
      specificGifts: formData.specificGifts.map(gift => 
        gift.id === id ? { ...gift, [field]: value } : gift
      )
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const updateField = (field: keyof ResidueData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const isValid = formData.distributionType;

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle>Residue & Specific Gifts</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Specify how your remaining estate should be distributed and any specific gifts you wish to make.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Distribution of Residue</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="equal"
                  name="distributionType"
                  value="equal"
                  checked={formData.distributionType === 'equal'}
                  onChange={(e) => updateField('distributionType', e.target.value)}
                  className="rounded"
                />
                <Label htmlFor="equal">Equal shares to all beneficiaries</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="percentages"
                  name="distributionType"
                  value="percentages"
                  checked={formData.distributionType === 'percentages'}
                  onChange={(e) => updateField('distributionType', e.target.value)}
                  className="rounded"
                />
                <Label htmlFor="percentages">Specific percentages to each beneficiary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="custom"
                  name="distributionType"
                  value="custom"
                  checked={formData.distributionType === 'custom'}
                  onChange={(e) => updateField('distributionType', e.target.value)}
                  className="rounded"
                />
                <Label htmlFor="custom">Custom distribution (specify in special clauses)</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Specific Gifts (Optional)</Label>
              <Button onClick={addSpecificGift} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Gift
              </Button>
            </div>

            {formData.specificGifts.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  No specific gifts added yet. You can add items like jewelry, cars, or specific amounts of money.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.specificGifts.map((gift, index) => (
                  <div key={gift.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="default">
                        Gift {index + 1}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSpecificGift(gift.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`beneficiary-${gift.id}`}>Beneficiary *</Label>
                        <Input
                          id={`beneficiary-${gift.id}`}
                          value={gift.beneficiary}
                          onChange={(e) => updateSpecificGift(gift.id, 'beneficiary', e.target.value)}
                          placeholder="Name of person receiving this gift"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-${gift.id}`}>Item or Amount *</Label>
                        <Input
                          id={`item-${gift.id}`}
                          value={gift.itemOrAmount}
                          onChange={(e) => updateSpecificGift(gift.id, 'itemOrAmount', e.target.value)}
                          placeholder="e.g., £10,000 or 'My wedding ring'"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`notes-${gift.id}`}>Notes (Optional)</Label>
                      <Textarea
                        id={`notes-${gift.id}`}
                        value={gift.notes}
                        onChange={(e) => updateSpecificGift(gift.id, 'notes', e.target.value)}
                        placeholder="Any additional details about this gift..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="funeralWishes">Funeral Wishes (Optional)</Label>
            <Textarea
              id="funeralWishes"
              value={formData.funeralWishes}
              onChange={(e) => updateField('funeralWishes', e.target.value)}
              placeholder="Any specific wishes regarding your funeral arrangements..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialClauses">Special Clauses (Optional)</Label>
            <Textarea
              id="specialClauses"
              value={formData.specialClauses}
              onChange={(e) => updateField('specialClauses', e.target.value)}
              placeholder="Any special instructions or clauses you wish to include..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            className="button-base" 
            onClick={onNext}
            disabled={!isValid}
          >
            Next: Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
