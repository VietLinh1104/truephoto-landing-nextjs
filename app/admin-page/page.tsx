import prisma from '@/lib/db';
import { AdminDashboardClient } from './components/AdminDashboardClient';

export default async function AdminDashboard() {
  // Fetch data from Prisma
  const [documents, emailSubmissions, clientRequests] = await Promise.all([
    prisma.document.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        requestClient: {
          select: {
            fullname: true,
            email: true,
          },
        },
      },
    }),
    prisma.emailSubmission.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.requestClient.count(),
  ]);

  // Format documents for display
  const formattedDocuments = documents.map((doc) => ({
    id: doc.id_document,
    fileName: doc.file_name,
    client: doc.requestClient?.fullname || 'N/A',
    email: doc.requestClient?.email || 'N/A',
    status: doc.status_upload,
    date: doc.createdAt.toISOString().split('T')[0],
  }));

  // Format email submissions
  const formattedEmailSubmissions = emailSubmissions.map((email) => ({
    id: email.id_email_submission,
    email: email.client_email,
    date: email.createdAt.toISOString().split('T')[0],
  }));

  // Calculate stats
  const totalDocuments = await prisma.document.count();
  const totalEmailSubmissions = await prisma.emailSubmission.count();
  const successDocuments = await prisma.document.count({
    where: { status_upload: 'success' },
  });

  return (
    <AdminDashboardClient
      documents={formattedDocuments}
      emailSubmissions={formattedEmailSubmissions}
      stats={{
        totalDocuments,
        totalEmailSubmissions,
        totalClientRequests: clientRequests,
        successDocuments,
      }}
    />
  );
}
