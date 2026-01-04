import prisma from '@/lib/db';
import { ClientRequestsClient } from './components/ClientRequestsClient';

export default async function ClientRequestsPage() {
  const clientRequests = await prisma.requestClient.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  const formattedRequests = clientRequests.map((request) => ({
    id: request.id_request_client,
    fullname: request.fullname,
    email: request.email,
    phone_number: request.phone_number,
    address: request.address,
    processing_request_details: request.processing_request_details,
    request_status: request.request_status,
    created_at: request.createdAt.toISOString().split('T')[0],
    updated_at: request.updatedAt.toISOString().split('T')[0],
    user: request.user ? {
      username: request.user.username,
      email: request.user.email,
    } : null,
  }));

  // Calculate stats
  const stats = {
    total: clientRequests.length,
    pending: clientRequests.filter(r => r.request_status === 'Pending' || r.request_status === 'pending').length,
    inProgress: clientRequests.filter(r => r.request_status === 'In Progress' || r.request_status === 'in_progress').length,
    completed: clientRequests.filter(r => r.request_status === 'Completed' || r.request_status === 'completed').length,
  };

  return <ClientRequestsClient initialRequests={formattedRequests} stats={stats} />;
}
