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
  ArrowLeft,
  Search,
  MoreHorizontal,
  Mail,
  Calendar,
  Send,
  Trash2,
  Download
} from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockEmailSubmissions = [
  { id: '1', client_email: 'client1@example.com', created_at: '2024-01-15 10:30:00' },
  { id: '2', client_email: 'client2@example.com', created_at: '2024-01-15 14:20:00' },
  { id: '3', client_email: 'client3@example.com', created_at: '2024-01-16 09:15:00' },
  { id: '4', client_email: 'client4@example.com', created_at: '2024-01-16 11:45:00' },
  { id: '5', client_email: 'client5@example.com', created_at: '2024-01-17 16:00:00' },
  { id: '6', client_email: 'client6@example.com', created_at: '2024-01-18 08:30:00' },
  { id: '7', client_email: 'client7@example.com', created_at: '2024-01-18 13:20:00' },
  { id: '8', client_email: 'client8@example.com', created_at: '2024-01-19 10:10:00' },
];

export default function EmailSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmails = mockEmailSubmissions.filter(submission => {
    return submission.client_email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete email submission:', id);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    const csv = [
      ['Email', 'Date'],
      ...filteredEmails.map(e => [e.client_email, e.created_at])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-submissions.csv';
    a.click();
  };

  return (
    <div className="p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Submissions</h1>
              <p className="text-gray-600 mt-1">Manage all email subscriptions and submissions</p>
            </div>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockEmailSubmissions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockEmailSubmissions.filter(e => {
                  const date = new Date(e.created_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return date >= weekAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockEmailSubmissions.filter(e => {
                  const date = new Date(e.created_at);
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return date >= monthAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by email address..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Email Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Email Submissions</CardTitle>
            <CardDescription>List of all email subscriptions</CardDescription>
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
                {filteredEmails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No email submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmails.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{submission.client_email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {submission.created_at}
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
                            <DropdownMenuItem onClick={() => handleSendEmail(submission.client_email)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(submission.id)}
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
      </div>
    </div>
  );
}

