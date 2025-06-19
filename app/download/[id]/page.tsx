'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Download, ArrowLeft  } from 'lucide-react';
import { Document } from '@/app/types/models';
import { getOne } from '@/lib/apiClient';

interface User {
  id_user: string;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Deliverable {
  id_deliverables_document: string;
  customer_name: string;
  client_email: string;
  created_at: string;
  updated_at: string;
  file_description: string;
  Documents: Document[];
  User: User | null;
}

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;
  const [dataClient, setDataClient] = useState<Deliverable | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof id === 'string' || typeof id === 'number') {
          const res = await getOne<Deliverable>('deliverables-documents', id);
          setDataClient(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  if (!dataClient) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 md:p-10 w-full max-w-7xl">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
        <h2 className="text-center text-3xl font-w01-semibold text-primary mb-6">
          View File Submission Details
        </h2>

        <form className="space-y-6">
          <div className="flex gap-8">
            <div className="w-full max-w-5/12 flex flex-col gap-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={dataClient.customer_name}
                  disabled
                  className="block w-full px-4 py-3 border border-gray-300 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={dataClient.client_email}
                  disabled
                  className="block w-full px-4 py-3 border border-gray-300 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Processing Request Details
                </label>
                <textarea
                  rows={4}
                  value={dataClient.file_description}
                  disabled
                  className="block w-full px-4 py-3 border border-gray-300 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uploaded Files
              </label>
              <div className="space-y-4">
                {dataClient.Documents?.length > 0 ? (
                  dataClient.Documents.map((doc) => (
                    <div
                      key={doc.id_document}
                      className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-800">{doc.file_name}</p>
                          <p className="text-sm text-gray-500">
                            {Number(doc.size) ? (Number(doc.size) / 1024).toFixed(2) + ' KB' : 'Unknown size'}
                          </p>
                        </div>
                      </div>
                      <a
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn flex items-center gap-1 text-sm"
                      >
                        <Download size={16} /> Download
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No files uploaded.</p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Ghi chú liên hệ */}
        <div className="mt-6 text-center text-sm text-gray-600">
          If you have any issues, please contact us at{" "}
          <a
            href="mailto:sales@truediting.com"
            className="text-blue-600 hover:underline"
          >
            sales@truediting.com
          </a>
        </div>
      </div>
    </div>
  );
}
