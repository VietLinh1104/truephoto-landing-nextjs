"use client"
import { useState } from 'react';
import { MultipartFileUploader, type ExtendedUploadResult } from '../components/MultipartFileUploader';
import { create } from "@/lib/strapiClient";


export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

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

      // eslint-disable-next-line
      const res = await create('request-customers', formData);
      setShowSuccess(true);
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

        {showSuccess ? (
          <div className="text-center p-8 bg-green-50 rounded-lg">
            <h3 className="text-2xl font-semibold text-green-700 mb-4">Upload Successful!</h3>
            <p className="text-gray-700 mb-1">
              Thank you for your submission. We will send you a confirmation email shortly.
            </p>
            <p className="text-gray-600 mb-5">
              If you don&apos;t receive the confirmation email, please contact us at{' '}
              <a href="mailto:sales@truediting.com" className="text-blue-600 hover:underline">
                sales@truediting.com
              </a>
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="btn  text-center text-primary font-semibold transition duration-300 hover:text-white"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  console.log('upload/page.tsx received : ', result);
                  setDocumentId((result as ExtendedUploadResult).documentId || null);
                  setBtnDisabled(false);
                }}
              />
            </div>

            <button
              type="submit"
              disabled={btnDisabled}
              className="btn w-full text-center text-primary font-semibold transition duration-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Processing...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 