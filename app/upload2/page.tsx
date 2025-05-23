"use client"
import { useState } from 'react';
import { MultipartFileUploader } from '../components/MultipartFileUploader';
import { create } from "@/lib/strapiClient";

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [btnDisabled, setBtnDisabled] = useState(true);

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = {
        data: {
          fullName: (e.currentTarget.elements.namedItem('name') as HTMLInputElement)?.value,
          email: (e.currentTarget.elements.namedItem('email') as HTMLInputElement)?.value,
          phoneNumber: (e.currentTarget.elements.namedItem('phone') as HTMLInputElement)?.value,
          address: (e.currentTarget.elements.namedItem('address') as HTMLInputElement)?.value,
          processingRequestDetails: (e.currentTarget.elements.namedItem('message') as HTMLInputElement)?.value,
          note: "<p>Ghi chú nội bộ</p>",
          requestStatus: "Pending",
          document: {
            connect: { documentId: documentId }
          }
        }
      };

      console.log('upload2/page.tsx formData payload: ', formData);

      const res = await create('request-customers', formData);
      console.log('upload2/page.tsx create response:', res);
      setDocumentId(null);
      setBtnDisabled(true);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 md:p-10 w-full max-w-7xl">
        <h2 className="text-center text-3xl font-w01-rounded-regular text-black mb-6">
          Submit File Processing Request
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="flex gap-8">
            <div className="w-full max-w-5/12 flex flex-col gap-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address (optional)
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Processing Request Details
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  required
                  placeholder="Describe your request (e.g. translation, editing, scanning, etc...)"
                  className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <MultipartFileUploader 
              theme="light"
              onUploadSuccess={(result) => {
                console.log('upload2/page.tsx received : ', result);
                setDocumentId((result as any).documentId);
                setBtnDisabled(false);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={btnDisabled}
            className="btn w-full text-center text-primary font-semibold transition duration-300 hover:text-white"
          >
            {uploading ? 'Processing...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
} 