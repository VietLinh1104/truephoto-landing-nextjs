'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Phone,
  MapPin
} from 'lucide-react';

interface ClientRequest {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  processing_request_details: string;
  request_status: string;
  created_at: string;
  updated_at: string;
  user: { username: string; email: string } | null;
}

interface ClientRequestsClientProps {
  initialRequests: ClientRequest[];
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

export function ClientRequestsClient({ initialRequests, stats: initialStats }: ClientRequestsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);

  const filteredRequests = initialRequests.filter(request => {
    const matchesSearch = 
      request.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone_number.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || 
      request.request_status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') {
      return 'bg-green-100 text-green-800';
    } else if (statusLower === 'in progress' || statusLower === 'in_progress') {
      return 'bg-blue-100 text-blue-800';
    } else if (statusLower === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Requests</h1>
              <p className="text-gray-600 mt-1">Manage all client service requests</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialStats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialStats.inProgress}</div>
              <p className="text-xs text-muted-foreground mt-1">Being processed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialStats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">Finished</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or phone..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
            <CardDescription>
              {filteredRequests.length} of {initialRequests.length} requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.fullname}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.phone_number}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.request_status)}`}>
                          {request.request_status}
                        </span>
                      </TableCell>
                      <TableCell>{request.created_at}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedRequest(request)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Export
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
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                Complete information about this client request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Client Name</label>
                    <p className="mt-1">{selectedRequest.fullname}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedRequest.request_status)}`}>
                        {selectedRequest.request_status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </label>
                    <p className="mt-1">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Phone
                    </label>
                    <p className="mt-1">{selectedRequest.phone_number}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Address
                    </label>
                    <p className="mt-1">{selectedRequest.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created
                    </label>
                    <p className="mt-1">{selectedRequest.created_at}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Updated
                    </label>
                    <p className="mt-1">{selectedRequest.updated_at}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Request Details
                  </label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedRequest.processing_request_details}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

