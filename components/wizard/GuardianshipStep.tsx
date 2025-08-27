'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Baby } from 'lucide-react';

interface Guardian {
  id: string;
  fullName: string;
  relationship: string;
  address: string;
}

export interface GuardianshipData {
  hasMinorChildren: boolean;
  guardians: Guardian[];
  specialInstructions: string;
}

interface GuardianshipStepProps {
  data: GuardianshipData;
  onUpdate: (data: GuardianshipData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function GuardianshipStep({ data, onUpdate, onNext, onBack }: GuardianshipStepProps) {
  const [formData, setFormData] = useState<GuardianshipData>(data);

  const addGuardian = () => {
    const newGuardian: Guardian = {
      id: Date.now().toString(),
      fullName: '',
      relationship: '',
      address: '',
    };
    const updated = { ...formData, guardians: [...formData.guardians, newGuardian] };
    setFormData(updated);
    onUpdate(updated);
  };

  const removeGuardian = (id: string) => {
    const updated = { 
      ...formData, 
      guardians: formData.guardians.filter(guard => guard.id !== id) 
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const updateGuardian = (id: string, field: keyof Guardian, value: string) => {
    const updated = {
      ...formData,
      guardians: formData.guardians.map(guard => 
        guard.id === id ? { ...guard, [field]: value } : guard
      )
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const updateField = (field: keyof GuardianshipData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const isValid = !formData.hasMinorChildren || 
    (formData.hasMinorChildren && formData.guardians.length > 0 && 
     formData.guardians.every(guard => guard.fullName.trim() && guard.address.trim()));

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle>Guardianship</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          If you have children under 18, you can appoint guardians to care for them in the event of your death.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasMinorChildren"
              checked={formData.hasMinorChildren}
              onChange={(e) => updateField('hasMinorChildren', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="hasMinorChildren">I have children under 18 years old</Label>
          </div>

          {formData.hasMinorChildren && (
            <div className="space-y-4">
              {formData.guardians.length === 0 ? (
                <div className="text-center py-8">
                  <Baby className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    No guardians added yet. Click below to add your first guardian.
                  </p>
                  <Button onClick={addGuardian} className="button-base">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Guardian
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.guardians.map((guardian, index) => (
                    <div key={guardian.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="default">
                          Guardian {index + 1}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeGuardian(guardian.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${guardian.id}`}>Full Name *</Label>
                          <Input
                            id={`name-${guardian.id}`}
                            value={guardian.fullName}
                            onChange={(e) => updateGuardian(guardian.id, 'fullName', e.target.value)}
                            placeholder="Enter full name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`relationship-${guardian.id}`}>Relationship</Label>
                          <Input
                            id={`relationship-${guardian.id}`}
                            value={guardian.relationship}
                            onChange={(e) => updateGuardian(guardian.id, 'relationship', e.target.value)}
                            placeholder="e.g., Sister, Brother, Friend"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`address-${guardian.id}`}>Full Address *</Label>
                        <Textarea
                          id={`address-${guardian.id}`}
                          value={guardian.address}
                          onChange={(e) => updateGuardian(guardian.id, 'address', e.target.value)}
                          placeholder="Enter full address including postcode"
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                  ))}

                  <Button onClick={addGuardian} variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Guardian
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={(e) => updateField('specialInstructions', e.target.value)}
                  placeholder="Any special instructions regarding the care of your children..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {!formData.hasMinorChildren && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No guardianship arrangements needed. You can proceed to the next step.
              </p>
            </div>
          )}
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
            Next: Residue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
