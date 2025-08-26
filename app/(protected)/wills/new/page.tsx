'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, User, Plus } from 'lucide-react';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  status: string;
}

export default function NewWillPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients?pageSize=100');
      const data = await response.json();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWizard = async () => {
    if (!selectedClient) return;

    try {
      const response = await fetch('/api/wills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient,
          jsonPayload: {},
          draftMarkdown: '',
        }),
      });

      if (response.ok) {
        const will = await response.json();
        router.push(`/wills/${will.id}/wizard`);
      }
    } catch (error) {
      console.error('Error creating will:', error);
    }
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Will</h1>
        <p className="text-muted-foreground">Select a client to start the will creation wizard</p>
      </div>

      <div className="grid gap-6">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Select Client</CardTitle>
            <CardDescription>
              Choose the client for whom you want to create a will
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {filteredClients.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No clients found</p>
                    <Button variant="outline" className="mt-4" onClick={() => router.push('/clients')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Client
                    </Button>
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedClient === client.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedClient(client.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            {client.firstName} {client.lastName}
                          </h3>
                          {client.email && (
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                            {client.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedClient && (
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Ready to Start</CardTitle>
              <CardDescription>
                You're about to create a will for{' '}
                {clients.find(c => c.id === selectedClient)?.firstName}{' '}
                {clients.find(c => c.id === selectedClient)?.lastName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleStartWizard}
                className="button-base"
                size="lg"
              >
                Start Will Wizard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
