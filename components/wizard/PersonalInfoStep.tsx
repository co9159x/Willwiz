'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface PersonalInfoData {
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
}

interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onUpdate: (data: PersonalInfoData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PersonalInfoStep({ data, onUpdate, onNext, onBack }: PersonalInfoStepProps) {
  const [formData, setFormData] = useState<PersonalInfoData>(data);

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData };
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      (newData as any)[parent] = { ...(newData as any)[parent], [child]: value };
    } else {
      (newData as any)[field] = value;
    }
    
    setFormData(newData);
    onUpdate(newData);
  };

  const handleNext = () => {
    if (formData.fullName && formData.dateOfBirth && formData.address.line1 && formData.address.city && formData.address.postcode) {
      onNext();
    }
  };

  const isValid = formData.fullName && formData.dateOfBirth && formData.address.line1 && formData.address.city && formData.address.postcode;

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Please provide your personal details for the will.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Legal Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full legal name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dateOfBirth || undefined}
                onSelect={(date) => handleInputChange('dateOfBirth', date)}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <select
            id="maritalStatus"
            value={formData.maritalStatus}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="civil">Civil Partnership</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            value={formData.nationality}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            placeholder="e.g., British"
          />
        </div>

        <div className="space-y-4">
          <Label>Address *</Label>
          <div className="space-y-2">
            <Input
              placeholder="Address Line 1 *"
              value={formData.address.line1}
              onChange={(e) => handleInputChange('address.line1', e.target.value)}
              required
            />
            <Input
              placeholder="Address Line 2 (optional)"
              value={formData.address.line2}
              onChange={(e) => handleInputChange('address.line2', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="City *"
                value={formData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                required
              />
              <Input
                placeholder="Postcode *"
                value={formData.address.postcode}
                onChange={(e) => handleInputChange('address.postcode', e.target.value)}
                required
              />
            </div>
            <Input
              placeholder="Country"
              value={formData.address.country}
              onChange={(e) => handleInputChange('address.country', e.target.value)}
              defaultValue="UK"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            className="button-base" 
            onClick={handleNext}
            disabled={!isValid}
          >
            Next: Executors
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
