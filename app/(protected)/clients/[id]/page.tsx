'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Edit, Save, Plus, Eye, Send, Download } from 'lucide-react';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postcode?: string;
  country: string;
  status: string;
  wills: any[];
  notes: any[];
  documents: any[];
  tasks: any[];
  _count: {
    wills: number;
    notes: number;
    documents: number;
    tasks: number;
  };
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/clients/${params.id}`);
      if (response.ok) {
        const clientData = await response.json();
        setClient(clientData);
        setFormData({
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          email: clientData.email,
          phone: clientData.phone,
          addressLine1: clientData.addressLine1,
          addressLine2: clientData.addressLine2,
          city: clientData.city,
          postcode: clientData.postcode,
          country: clientData.country,
        });
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/clients/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditing(false);
        fetchClient(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(`/api/clients/${params.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newNote }),
      });

      if (response.ok) {
        setNewNote('');
        fetchClient(); // Refresh data
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`/api/clients/${params.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask }),
      });

      if (response.ok) {
        setNewTask('');
        fetchClient(); // Refresh data
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCreateWill = async () => {
    try {
      const response = await fetch('/api/wills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: params.id,
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

  if (!client) {
    return (
      <div className="container mx-auto p-6">
        <Card className="card-glass">
          <CardContent className="pt-6">
            <p>Client not found</p>
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
          <h1 className="text-3xl font-bold">
            {client.firstName} {client.lastName}
          </h1>
          <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
            {client.status}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Client ID: {client.id}
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({client._count.wills})</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({client._count.tasks})</TabsTrigger>
          <TabsTrigger value="notes">Notes ({client._count.notes})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({client._count.documents})</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="card-glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Client Profile</CardTitle>
                  <CardDescription>Personal and contact information</CardDescription>
                </div>
                <Button
                  variant={editing ? 'default' : 'outline'}
                  onClick={() => editing ? handleSave() : setEditing(true)}
                >
                  {editing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!editing}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="addressLine1">Address Line 1</Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1 || ''}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    disabled={!editing}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2 || ''}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    value={formData.postcode || ''}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    disabled={!editing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card className="card-glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Will Drafts</CardTitle>
                  <CardDescription>Manage will drafts and documents</CardDescription>
                </div>
                <Button onClick={handleCreateWill} className="button-base">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Will
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {client.wills.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No will drafts found</p>
                  <Button variant="outline" className="mt-4" onClick={handleCreateWill}>
                    Create First Will
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.wills.map((will) => (
                      <TableRow key={will.id}>
                        <TableCell>v{will.version}</TableCell>
                        <TableCell>
                          <Badge variant={
                            will.status === 'draft' ? 'secondary' :
                            will.status === 'sent_for_approval' ? 'default' :
                            'default'
                          }>
                            {will.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(will.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/wills/${will.id}/wizard`)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            {will.status === 'draft' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/wills/${will.id}/wizard`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Manage client tasks and to-dos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                  <Button onClick={handleAddTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {client.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox checked={task.completed} />
                      <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Client notes and observations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a new note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button onClick={handleAddNote}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>

                <div className="space-y-4">
                  {client.notes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <p className="mb-2">{note.body}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Client documents and uploads</CardDescription>
            </CardHeader>
            <CardContent>
              {client.documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No documents found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.kind}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
