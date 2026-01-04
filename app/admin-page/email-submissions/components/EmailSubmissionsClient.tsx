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
  Mail,
  Calendar,
  Send,
  Trash2,
  Download
} from 'lucide-react';

interface EmailSubmission {
  id: string;
  client_email: string;
  created_at: string;
}

interface EmailSubmissionsClientProps {
  initialSubmissions: EmailSubmission[];
  stats: {
    total: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export function EmailSubmissionsClient({ initialSubmissions, stats: initialStats }: EmailSubmissionsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmails = initialSubmissions.filter(submission => {
    return submission.client_email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this email submission?')) {
      try {
        const response = await fetch(`/api/email-submissions/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error deleting email submission:', error);
      }
    }
  };

  const handleExport = () => {
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
              <div className="text-2xl font-bold">{initialStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialStats.thisWeek}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{initialStats.thisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Current month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <Input
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>
              {filteredEmails.length} of {initialSubmissions.length} submissions
            </CardDescription>
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
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No email submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmails.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.client_email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
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

