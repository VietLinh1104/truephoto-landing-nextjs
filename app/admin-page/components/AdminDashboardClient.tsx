'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Users,
  Mail, 
  Plus,
  MoreHorizontal,
  Download,
  Eye
} from 'lucide-react';
import { AdminFileUploader } from './AdminFileUploader';

interface Document {
  id: string;
  fileName: string;
  client: string;
  email: string;
  status: string;
  date: string;
}

interface EmailSubmission {
  id: string;
  email: string;
  date: string;
}

interface Stats {
  totalDocuments: number;
  totalEmailSubmissions: number;
  totalClientRequests: number;
  successDocuments: number;
}

interface AdminDashboardClientProps {
  documents: Document[];
  emailSubmissions: EmailSubmission[];
  stats: Stats;
}

export function AdminDashboardClient({ documents, emailSubmissions, stats }: AdminDashboardClientProps) {
  const [activeTab] = useState<'dashboard' | 'documents' | 'emails' | 'settings'>('dashboard');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  return (
    <div className="p-6">
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">Welcome to True Photo Admin Dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                <p className="text-xs text-muted-foreground">+{stats.successDocuments} successful uploads</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Submissions</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEmailSubmissions}</div>
                <p className="text-xs text-muted-foreground">Total subscriptions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Client Requests</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClientRequests}</div>
                <p className="text-xs text-muted-foreground">All time requests</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Latest uploaded documents</CardDescription>
              </div>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[800px] max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>
                      Upload a new document to the system
                    </DialogDescription>
                  </DialogHeader>
                  <AdminFileUploader
                    onUploadSuccess={() => {
                      setIsUploadDialogOpen(false);
                      window.location.reload();
                    }}
                    onUploadError={(error) => {
                      console.error('Upload error:', error);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.fileName}</TableCell>
                        <TableCell>{doc.client}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            doc.status === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : doc.status === 'error'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doc.status}
                          </span>
                        </TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Email Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Submissions</CardTitle>
              <CardDescription>Latest email subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailSubmissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">
                        No email submissions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    emailSubmissions.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell>{email.email}</TableCell>
                        <TableCell>{email.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

