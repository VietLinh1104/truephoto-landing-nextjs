'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
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

// Mock data
const mockDeliverables = [
  {
    id: '1',
    customer_name: 'John Doe',
    client_email: 'john@example.com',
    file_description: 'Professional real estate photography package',
    created_at: '2024-01-15',
    updated_at: '2024-01-18',
    Documents: [
      { id_document: '1', file_name: 'property-photo-1.jpg', document_url: 'https://example.com/photo1.jpg', size: 2048000 },
      { id_document: '2', file_name: 'property-photo-2.jpg', document_url: 'https://example.com/photo2.jpg', size: 1856000 },
    ]
  },
  {
    id: '2',
    customer_name: 'Jane Smith',
    client_email: 'jane@example.com',
    file_description: 'Virtual tour and floor plans',
    created_at: '2024-01-16',
    updated_at: '2024-01-19',
    Documents: [
      { id_document: '3', file_name: 'virtual-tour.mp4', document_url: 'https://example.com/tour.mp4', size: 15728640 },
    ]
  },
  {
    id: '3',
    customer_name: 'Bob Johnson',
    client_email: 'bob@example.com',
    file_description: 'Aerial photography collection',
    created_at: '2024-01-17',
    updated_at: '2024-01-20',
    Documents: [
      { id_document: '4', file_name: 'aerial-1.jpg', document_url: 'https://example.com/aerial1.jpg', size: 3072000 },
      { id_document: '5', file_name: 'aerial-2.jpg', document_url: 'https://example.com/aerial2.jpg', size: 2944000 },
      { id_document: '6', file_name: 'aerial-3.jpg', document_url: 'https://example.com/aerial3.jpg', size: 2816000 },
    ]
  },
];

export default function DeliverablesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeliverable, setSelectedDeliverable] = useState<typeof mockDeliverables[0] | null>(null);

  const filteredDeliverables = mockDeliverables.filter(deliverable => {
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
              <div className="text-2xl font-bold">{mockDeliverables.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockDeliverables.reduce((sum, d) => sum + d.Documents.length, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatFileSize(
                  mockDeliverables.reduce((sum, d) => 
                    sum + d.Documents.reduce((docSum, doc) => docSum + doc.size, 0), 0
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by customer name, email, or description..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Deliverables Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Deliverables</CardTitle>
            <CardDescription>List of all client deliverables</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliverables.map((deliverable) => (
                  <TableRow key={deliverable.id}>
                    <TableCell>
                      <div className="font-medium">{deliverable.customer_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">{deliverable.client_email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md truncate text-sm">
                        {deliverable.file_description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{deliverable.Documents.length} files</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{deliverable.created_at}</div>
                    </TableCell>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        {selectedDeliverable && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Deliverable Details</CardTitle>
                    <CardDescription>Complete information and documents</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDeliverable(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4" />
                      Customer Name
                    </div>
                    <div className="text-sm text-gray-600">{selectedDeliverable.customer_name}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <div className="text-sm text-gray-600">{selectedDeliverable.client_email}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4" />
                    Description
                  </div>
                  <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
                    {selectedDeliverable.file_description}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Package className="h-4 w-4" />
                    Documents ({selectedDeliverable.Documents.length})
                  </div>
                  <div className="space-y-2">
                    {selectedDeliverable.Documents.map((doc) => (
                      <div key={doc.id_document} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-sm">{doc.file_name}</div>
                            <div className="text-xs text-gray-500">{formatFileSize(doc.size)}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      Created At
                    </div>
                    <div className="text-sm text-gray-600">{selectedDeliverable.created_at}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      Updated At
                    </div>
                    <div className="text-sm text-gray-600">{selectedDeliverable.updated_at}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

