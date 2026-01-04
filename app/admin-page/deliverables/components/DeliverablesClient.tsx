'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Search,
  MoreHorizontal,
  Eye,
  Download,
  FileText,
  Calendar,
  User,
  Mail,
  Package
} from 'lucide-react';

interface Document {
  id_document: string;
  file_name: string;
  document_url: string;
  size: number;
}

interface Deliverable {
  id: string;
  customer_name: string;
  client_email: string;
  file_description: string;
  created_at: string;
  updated_at: string;
  Documents: Document[];
}

interface DeliverablesClientProps {
  initialDeliverables: Deliverable[];
  stats: {
    total: number;
    totalFiles: number;
    totalSize: number;
  };
}

export function DeliverablesClient({ initialDeliverables, stats: initialStats }: DeliverablesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);

  const filteredDeliverables = initialDeliverables.filter(deliverable => {
    return (
      deliverable.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliverable.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliverable.file_description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Deliverables</h1>
              <p className="text-gray-600 mt-1">Manage all client deliverables and documents</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All packages</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialStats.totalFiles}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {initialStats.totalFiles} files across all deliverables
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(initialStats.totalSize)}</div>
              <p className="text-xs text-muted-foreground mt-1">Combined file size</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <Input
            placeholder="Search by customer name, email, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Deliverables</CardTitle>
            <CardDescription>
              {filteredDeliverables.length} of {initialDeliverables.length} deliverables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliverables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No deliverables found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeliverables.map((deliverable) => (
                    <TableRow key={deliverable.id}>
                      <TableCell className="font-medium">{deliverable.customer_name}</TableCell>
                      <TableCell>{deliverable.client_email}</TableCell>
                      <TableCell className="max-w-xs truncate">{deliverable.file_description}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {deliverable.Documents.length} files
                        </span>
                      </TableCell>
                      <TableCell>{deliverable.created_at}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedDeliverable(deliverable)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download All
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selectedDeliverable} onOpenChange={() => setSelectedDeliverable(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Deliverable Details</DialogTitle>
              <DialogDescription>
                Complete information about this deliverable package
              </DialogDescription>
            </DialogHeader>
            {selectedDeliverable && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Customer Name
                    </label>
                    <p className="mt-1">{selectedDeliverable.customer_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </label>
                    <p className="mt-1">{selectedDeliverable.client_email}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Description
                    </label>
                    <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedDeliverable.file_description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created
                    </label>
                    <p className="mt-1">{selectedDeliverable.created_at}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Files
                    </label>
                    <p className="mt-1">{selectedDeliverable.Documents.length} files</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Files</label>
                  <div className="space-y-2">
                    {selectedDeliverable.Documents.map((doc) => (
                      <div key={doc.id_document} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{doc.file_name}</span>
                          <span className="text-xs text-gray-500">({formatFileSize(doc.size)})</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

