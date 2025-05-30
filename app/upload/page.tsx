"use client"
import { useState } from 'react';
import { MultipartFileUploader, type ExtendedUploadResult } from '../components/MultipartFileUploader';
import { create } from "@/lib/strapiClient";

interface ClientRequestFormData {
  fullName: string,
  email: string,
  phoneNumber: string,
  address: string,
  processingRequestDetails: string,
}

export default function Home() {

  const [documentId, setDocumentId] = useState<string | null>(null);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ClientRequestFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    processingRequestDetails: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const submitData = {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          // processingRequestDetails: formData.processingRequestDetails,
          processingRequestDetails: documentId,
          // files: documentId ? {
          //   connect: [
          //     { documentId: documentId }
          //   ]
          // } : null
      };

      // const submitData = {
      //   "files": {
      //     "connect": {
      //       "documentId": "z6tm2eboubk61e7279a5hphk"
      //     }
      //   }
      // };

      const response = await create('request-clients', submitData);
      console.log('Response from Strapi:', response);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating request-clients:', error);
    } finally {
      setSaving(false);
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
                    name="fullName"
                    id="name"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
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
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phone"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
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
                    value={formData.address}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Processing Request Details
                  </label>
                  <textarea
                    name="processingRequestDetails"
                    id="message"
                    rows={4}
                    required
                    value={formData.processingRequestDetails}
                    onChange={handleInputChange}
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
              {saving ? 'Processing...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 