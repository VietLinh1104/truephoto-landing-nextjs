'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Search,
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
  FileText,
  Calendar,
  HardDrive,
  CheckCircle,
  XCircle,
  Filter,
  Plus,
  Upload
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdminFileUploader } from '../components/AdminFileUploader';
import type { Document } from '@/lib/client';

// Mock data
const mockDocuments = [
  {
    id_document: '1',
    id_request_client: '1',
    id_deliverables_document: null,
    file_name: 'property-photo-1.jpg',
    key: 'documents/property-photo-1.jpg',
    bucket_name: 'truephoto-storage',
    document_url: 'https://example.com/photo1.jpg',
    size: 2048000,
    mine_type: 'image/jpeg',
    status_upload: 'success',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id_document: '2',
    id_request_client: '1',
    id_deliverables_document: null,
    file_name: 'property-photo-2.jpg',
    key: 'documents/property-photo-2.jpg',
    bucket_name: 'truephoto-storage',
    document_url: 'https://example.com/photo2.jpg',
    size: 1856000,
    mine_type: 'image/jpeg',
    status_upload: 'success',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z',
  },
  {
    id_document: '3',
    id_request_client: '2',
    id_deliverables_document: null,
    file_name: 'virtual-tour.mp4',
    key: 'documents/virtual-tour.mp4',
    bucket_name: 'truephoto-storage',
    document_url: 'https://example.com/tour.mp4',
    size: 15728640,
    mine_type: 'video/mp4',
    status_upload: 'success',
    created_at: '2024-01-16T09:15:00Z',
    updated_at: '2024-01-16T09:15:00Z',
  },
  {
    id_document: '4',
    id_request_client: null,
    id_deliverables_document: '1',
    file_name: 'aerial-1.jpg',
    key: 'documents/aerial-1.jpg',
    bucket_name: 'truephoto-storage',
    document_url: 'https://example.com/aerial1.jpg',
    size: 3072000,
    mine_type: 'image/jpeg',
    status_upload: 'success',
    created_at: '2024-01-17T14:20:00Z',
    updated_at: '2024-01-17T14:20:00Z',
  },
  {
    id_document: '5',
    id_request_client: '3',
    id_deliverables_document: null,
    file_name: 'floor-plan.pdf',
    key: 'documents/floor-plan.pdf',
    bucket_name: 'truephoto-storage',
    document_url: 'https://example.com/floor-plan.pdf',
    size: 512000,
    mine_type: 'application/pdf',
    status_upload: 'error',
    created_at: '2024-01-18T16:45:00Z',
    updated_at: '2024-01-18T16:45:00Z',
  },
  {
    id_document: '6',
    id_request_client: null,
    id_deliverables_document: '2',
    file_name: 'property-video.mp4',
    key: 'documents/property-video.mp4',
    bucket_name: 'truephoto-storage',
    document_url: 'https://example.com/video.mp4',
    size: 52428800,
    mine_type: 'video/mp4',
    status_upload: 'success',
    created_at: '2024-01-19T10:00:00Z',
    updated_at: '2024-01-19T10:00:00Z',
  },
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<typeof mockDocuments[0] | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = 
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.bucket_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || doc.status_upload === statusFilter;
    
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'image' && doc.mine_type.startsWith('image/')) ||
      (typeFilter === 'video' && doc.mine_type.startsWith('video/')) ||
      (typeFilter === 'document' && !doc.mine_type.startsWith('image/') && !doc.mine_type.startsWith('video/'));
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.includes('pdf')) return '📄';
    return '📎';
  };

  const handleDelete = (documentId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete document:', documentId);
  };

  const handleUploadSuccess = (document: Document) => {
    console.log('Upload successful:', document);
    // TODO: Refresh documents list or add to state
    setIsUploadDialogOpen(false);
    setUploading(false);
    // You can add a toast notification here
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
    setUploading(false);
    // You can add a toast notification here
  };

  const handleUploadClick = () => {
    setUploading(true);
  };

  const totalSize = mockDocuments.reduce((sum, doc) => sum + doc.size, 0);
  const successCount = mockDocuments.filter(doc => doc.status_upload === 'success').length;
  const errorCount = mockDocuments.filter(doc => doc.status_upload === 'error').length;

  return (
    <div className="p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Manage all uploaded documents and files</p>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleUploadClick}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[800px] max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload files using the same API as the landing page
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <AdminFileUploader
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDocuments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by file name, key, or bucket..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>
              {filteredDocuments.length} of {mockDocuments.length} documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Bucket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id_document}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getFileTypeIcon(doc.mine_type)}</span>
                          <div>
                            <div className="font-medium">{doc.file_name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {doc.key}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.mine_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatFileSize(doc.size)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <HardDrive className="h-4 w-4 text-gray-400" />
                          {doc.bucket_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.status_upload === 'success' ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            <XCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {formatDate(doc.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedDocument(doc)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(doc.id_document)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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

        {/* View Details Dialog */}
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Document Details</DialogTitle>
              <DialogDescription>Complete information about the document</DialogDescription>
            </DialogHeader>
            {selectedDocument && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">File Name</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getFileTypeIcon(selectedDocument.mine_type)}</span>
                      <div className="font-medium">{selectedDocument.file_name}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">File Type</div>
                    <Badge variant="outline">{selectedDocument.mine_type}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Key</div>
                  <div className="text-sm p-2 bg-gray-50 rounded-md font-mono">
                    {selectedDocument.key}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Bucket Name</div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-gray-400" />
                      <span>{selectedDocument.bucket_name}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">File Size</div>
                    <div>{formatFileSize(selectedDocument.size)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    {selectedDocument.status_upload === 'success' ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Success
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <XCircle className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Document ID</div>
                    <div className="text-sm font-mono">{selectedDocument.id_document}</div>
                  </div>
                </div>
                {selectedDocument.id_request_client && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Request Client ID</div>
                    <div className="text-sm font-mono">{selectedDocument.id_request_client}</div>
                  </div>
                )}
                {selectedDocument.id_deliverables_document && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Deliverables Document ID</div>
                    <div className="text-sm font-mono">{selectedDocument.id_deliverables_document}</div>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Document URL</div>
                  <div className="text-sm p-2 bg-gray-50 rounded-md font-mono break-all">
                    {selectedDocument.document_url}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Created At</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedDocument.created_at)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Updated At</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedDocument.updated_at)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button asChild className="flex-1">
                    <a href={selectedDocument.document_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(selectedDocument.id_document)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

