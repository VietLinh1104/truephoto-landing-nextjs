import prisma from '@/lib/db';
import { DeliverablesClient } from './components/DeliverablesClient';

export default async function DeliverablesPage() {
  const deliverables = await prisma.deliverablesDocument.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      documents: {
        select: {
          id_document: true,
          file_name: true,
          document_url: true,
          size: true,
        },
      },
    },
  });

  const formattedDeliverables = deliverables.map((deliverable) => ({
    id: deliverable.id_deliverables_document,
    customer_name: deliverable.customer_name,
    client_email: deliverable.client_email,
    file_description: deliverable.file_description,
    created_at: deliverable.createdAt.toISOString().split('T')[0],
    updated_at: deliverable.updatedAt.toISOString().split('T')[0],
    Documents: deliverable.documents.map((doc) => ({
      id_document: doc.id_document,
      file_name: doc.file_name,
      document_url: doc.document_url,
      size: typeof doc.size === 'string' ? parseInt(doc.size) : Number(doc.size),
    })),
  }));

  // Calculate stats
  const stats = {
    total: deliverables.length,
    totalFiles: deliverables.reduce((sum, d) => sum + d.documents.length, 0),
    totalSize: deliverables.reduce((sum, d) => 
      sum + d.documents.reduce((fileSum, file) => 
        fileSum + (typeof file.size === 'string' ? parseInt(file.size) : Number(file.size)), 0
      ), 0
    ),
  };

  return <DeliverablesClient initialDeliverables={formattedDeliverables} stats={stats} />;
}
