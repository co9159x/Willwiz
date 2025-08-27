'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, User } from 'lucide-react';

interface Executor {
  id: string;
  fullName: string;
  relationship: string;
  address: string;
  isReserve: boolean;
}

interface ExecutorsStepProps {
  data: Executor[];
  onUpdate: (data: Executor[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ExecutorsStep({ data, onUpdate, onNext, onBack }: ExecutorsStepProps) {
  const [executors, setExecutors] = useState<Executor[]>(data);

  const addExecutor = () => {
    const newExecutor: Executor = {
      id: Date.now().toString(),
      fullName: '',
      relationship: '',
      address: '',
      isReserve: false,
    };
    const updated = [...executors, newExecutor];
    setExecutors(updated);
    onUpdate(updated);
  };

  const removeExecutor = (id: string) => {
    const updated = executors.filter(exec => exec.id !== id);
    setExecutors(updated);
    onUpdate(updated);
  };

  const updateExecutor = (id: string, field: keyof Executor, value: any) => {
    const updated = executors.map(exec => 
      exec.id === id ? { ...exec, [field]: value } : exec
    );
    setExecutors(updated);
    onUpdate(updated);
  };

  const toggleReserve = (id: string) => {
    const updated = executors.map(exec => 
      exec.id === id ? { ...exec, isReserve: !exec.isReserve } : exec
    );
    setExecutors(updated);
    onUpdate(updated);
  };

  const isValid = executors.length > 0 && executors.every(exec => 
    exec.fullName.trim() && exec.relationship.trim() && exec.address.trim()
  );

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle>Executors</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Executors are responsible for carrying out the terms of your will. You should appoint at least one executor.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {executors.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No executors added yet. Click below to add your first executor.
            </p>
            <Button onClick={addExecutor} className="button-base">
              <Plus className="mr-2 h-4 w-4" />
              Add Executor
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {executors.map((executor, index) => (
              <div key={executor.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={executor.isReserve ? "secondary" : "default"}>
                      {executor.isReserve ? "Reserve" : `Executor ${index + 1}`}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReserve(executor.id)}
                    >
                      {executor.isReserve ? "Make Primary" : "Make Reserve"}
                    </Button>
                    {executors.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExecutor(executor.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${executor.id}`}>Full Name *</Label>
                    <Input
                      id={`name-${executor.id}`}
                      value={executor.fullName}
                      onChange={(e) => updateExecutor(executor.id, 'fullName', e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`relationship-${executor.id}`}>Relationship *</Label>
                    <Input
                      id={`relationship-${executor.id}`}
                      value={executor.relationship}
                      onChange={(e) => updateExecutor(executor.id, 'relationship', e.target.value)}
                      placeholder="e.g., Spouse, Child, Friend"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`address-${executor.id}`}>Full Address *</Label>
                  <Textarea
                    id={`address-${executor.id}`}
                    value={executor.address}
                    onChange={(e) => updateExecutor(executor.id, 'address', e.target.value)}
                    placeholder="Enter full address including postcode"
                    rows={3}
                    required
                  />
                </div>
              </div>
            ))}

            <Button onClick={addExecutor} variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Another Executor
            </Button>
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
            Next: Beneficiaries
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
