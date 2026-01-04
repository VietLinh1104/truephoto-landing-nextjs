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
  Calendar,
  HardDrive,
  CheckCircle,
  XCircle,
  Filter,
  Plus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdminFileUploader } from '../../components/AdminFileUploader';

interface Document {
  id_document: string;
  id_request_client: string | null;
  id_deliverables_document: string | null;
  file_name: string;
  key: string;
  bucket_name: string;
  document_url: string;
  size: number;
  mine_type: string;
  status_upload: string;
  created_at: string;
  updated_at: string;
  requestClient: { fullname: string; email: string } | null;
  deliverablesDocument: { customer_name: string; client_email: string } | null;
}

interface DocumentsClientProps {
  initialDocuments: Document[];
  stats: {
    total: number;
    totalSize: number;
    successCount: number;
    errorCount: number;
    pendingCount: number;
  };
}

export function DocumentsClient({ initialDocuments, stats: initialStats }: DocumentsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const filteredDocuments = initialDocuments.filter(doc => {
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

  const handleDelete = async (documentId: string, key: string) => {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        // Call API to delete from R2 and database
        const response = await fetch(`/api/multipart-upload/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key }),
        });
        
        if (response.ok) {
          // Also delete from database
          await fetch(`/api/documents/${documentId}`, {
            method: 'DELETE',
          });
          window.location.reload();
        } else {
          alert('Failed to delete document');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Error deleting document');
      }
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    link.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Success</Badge>;
      case 'error':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Error</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Calendar className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[800px] max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a new document to the system. Files will be stored in Cloudflare R2.
                </DialogDescription>
              </DialogHeader>
              <AdminFileUploader
                onUploadSuccess={() => {
                  setIsUploadDialogOpen(false);
                  window.location.reload();
                }}
                onUploadError={(error) => {
                  console.error('Upload error:', error);
                  alert('Upload failed. Please try again.');
                }}
              />
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
              <div className="text-2xl font-bold">{initialStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All files</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(initialStats.totalSize)}</div>
              <p className="text-xs text-muted-foreground mt-1">Combined storage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{initialStats.successCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Uploaded successfully</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{initialStats.errorCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Failed uploads</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by file name, key, or bucket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>
              {filteredDocuments.length} of {initialDocuments.length} documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      No documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id_document}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{getFileTypeIcon(doc.mine_type)}</span>
                          <span className="font-medium">{doc.file_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.mine_type}</Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(doc.size)}</TableCell>
                      <TableCell>{getStatusBadge(doc.status_upload)}</TableCell>
                      <TableCell>
                        {doc.requestClient ? (
                          <div>
                            <div className="font-medium">{doc.requestClient.fullname}</div>
                            <div className="text-xs text-gray-500">{doc.requestClient.email}</div>
                          </div>
                        ) : doc.deliverablesDocument ? (
                          <div>
                            <div className="font-medium">{doc.deliverablesDocument.customer_name}</div>
                            <div className="text-xs text-gray-500">{doc.deliverablesDocument.client_email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
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
                            <DropdownMenuItem onClick={() => setSelectedDocument(doc)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(doc.document_url, doc.file_name)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(doc.id_document, doc.key)}
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

        {/* Detail Dialog */}
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Document Details</DialogTitle>
              <DialogDescription>
                Complete information about this document
              </DialogDescription>
            </DialogHeader>
            {selectedDocument && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">File Name</label>
                    <p className="mt-1 font-medium">{selectedDocument.file_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedDocument.status_upload)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Size</label>
                    <p className="mt-1">{formatFileSize(selectedDocument.size)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">MIME Type</label>
                    <p className="mt-1">{selectedDocument.mine_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bucket</label>
                    <p className="mt-1 flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      {selectedDocument.bucket_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Key</label>
                    <p className="mt-1 text-xs font-mono">{selectedDocument.key}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="mt-1">{formatDate(selectedDocument.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Updated</label>
                    <p className="mt-1">{formatDate(selectedDocument.updated_at)}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">URL</label>
                  <p className="mt-1 text-xs break-all bg-gray-50 p-2 rounded">{selectedDocument.document_url}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleDownload(selectedDocument.document_url, selectedDocument.file_name)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleDelete(selectedDocument.id_document, selectedDocument.key);
                      setSelectedDocument(null);
                    }}
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

