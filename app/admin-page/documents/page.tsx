import prisma from '@/lib/db';
import { DocumentsClient } from './components/DocumentsClient';

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      requestClient: {
        select: {
          fullname: true,
          email: true,
        },
      },
      deliverablesDocument: {
        select: {
          customer_name: true,
          client_email: true,
        },
      },
    },
  });

  const formattedDocuments = documents.map((doc) => ({
    id_document: doc.id_document,
    id_request_client: doc.id_request_client,
    id_deliverables_document: doc.id_deliverables_document,
    file_name: doc.file_name,
    key: doc.key,
    bucket_name: doc.bucket_name,
    document_url: doc.document_url,
    size: typeof doc.size === 'string' ? parseInt(doc.size) : Number(doc.size),
    mine_type: doc.mine_type,
    status_upload: doc.status_upload,
    created_at: doc.createdAt.toISOString(),
    updated_at: doc.updatedAt.toISOString(),
    requestClient: doc.requestClient,
    deliverablesDocument: doc.deliverablesDocument,
  }));

  // Calculate stats
  const stats = {
    total: documents.length,
    totalSize: documents.reduce((sum, doc) => 
      sum + (typeof doc.size === 'string' ? parseInt(doc.size) : Number(doc.size)), 0
    ),
    successCount: documents.filter(doc => doc.status_upload === 'success').length,
    errorCount: documents.filter(doc => doc.status_upload === 'error').length,
    pendingCount: documents.filter(doc => doc.status_upload === 'pending').length,
  };

  return <DocumentsClient initialDocuments={formattedDocuments} stats={stats} />;
}
