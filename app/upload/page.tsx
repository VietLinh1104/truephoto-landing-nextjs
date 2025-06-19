"use client";

import React, { useRef, useState } from "react";
import { MultipartFileUploader } from "../components/MultipartFileUploader2";
import { create } from "@/lib/apiClient";
import { ArrowLeft  } from 'lucide-react';
import {useRouter } from 'next/navigation';
import { UppyFile } from "@uppy/core";

interface UploadData {
  id_document?: string;
  id_request_client?: string;
  id_deliverables_document?: string;
  file_name: string;
  key: string;
  bucket_name: string;
  document_url: string;
  size: number;
  mine_type: string;
  status_upload: "success" | "error";
}

interface RequestClient {
  id_request_client?: string;
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  processing_request_details: string;
  request_status: string;
  created_at: string | null;
  updated_at: string | null;
  User: User | null;
}

interface User {
  id_user: string;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const defaultClientData: RequestClient = {
  fullname: "",
  email: "",
  phone_number: "",
  address: "",
  processing_request_details: "",
  request_status: "Pending",
  created_at: null,
  updated_at: null,
  User: null,
};

const createClient = async (data: RequestClient): Promise<RequestClient | null> => {
  try {
    const response = await create<RequestClient>("request-clients", data);
    console.log("Tạo thành công:", response.data);
    return response.data;
  } catch (err) {
    console.error("Tạo thất bại:", err);
    return null;
  }
};

export default function Home() {
  const [clientData, setClientData] = useState<RequestClient>(defaultClientData);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const triggerUploadRef = useRef<(() => Promise<UploadData>) | null>(null);
  const router = useRouter();

  const sanitizeInput = (input: string): string => {
    return input.replace(/[<>]/g, ""); // Basic XSS sanitization
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      [name]: sanitizeInput(value),
    }));
  };

  const handleFileAdded = (file: UppyFile) => {
    console.log("File được thêm:", file.name);
    setBtnDisabled(false);
  };

  const handleFileRemoved = (file: UppyFile) => {
    console.log("File bị xóa:", file.name);
    setBtnDisabled(true);
  };

  const handleUploadSuccess = (documentId: string) => {
    console.log("Upload thành công, ID tài liệu:", documentId);
  };

  const handleUploadComplete = () => {
    console.log("Hoàn tất quá trình upload");
    setBtnDisabled(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setBtnDisabled(true);
    setErrorMessage(null);

    try {
      const clientRes = await createClient(clientData);
      if (!clientRes || !clientRes.id_request_client) {
        throw new Error("Failed to create request-client: No id_request_client returned");
      }

      setClientData((prev) => ({
        ...prev,
        id_request_client: clientRes.id_request_client,
      }));

      if (triggerUploadRef.current) {
        const uploadData = await triggerUploadRef.current();
        if (!uploadData || uploadData.status_upload !== "success") {
          throw new Error("File upload failed or returned an invalid response");
        }
      }

      setShowSuccess(true);
      setClientData(defaultClientData); // Reset form
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Submission error:", error);
        setErrorMessage(error.message || "An error occurred while submitting the form. Please try again.");
      } else {
        console.error("Unknown error:", error);
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setSaving(false);
    }

    setBtnDisabled(true);
  };

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
        <h2 className="text-center text-3xl font-w01-semibold text-black mb-6">
          Submit File Processing Request
        </h2>

        {showSuccess ? (
          <div className="text-center p-8 bg-green-50 rounded-lg" role="alert">
            <h3 className="text-2xl font-semibold text-green-700 mb-4">Upload Successful!</h3>
            <p className="text-gray-700 mb-1">
              Thank you for your submission. We will send you a confirmation email shortly.
            </p>
            <p className="text-gray-600 mb-5">
              If you don&apos;t receive the confirmation email, please contact us at{" "}
              <a href="mailto:sales@truediting.com" className="text-blue-600 hover:underline">
                sales@truediting.com
              </a>
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="btn text-center text-primary font-semibold transition duration-300 hover:text-white"
              aria-label="Submit another request"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="flex gap-8">
              <div className="w-full max-w-5/12 flex flex-col gap-y-3">
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    required
                    value={clientData.fullname}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    aria-required="true"
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
                    value={clientData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    id="phone_number"
                    value={clientData.phone_number}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                    value={clientData.address}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="processing_request_details"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Processing Request Details
                  </label>
                  <textarea
                    name="processing_request_details"
                    id="processing_request_details"
                    rows={4}
                    required
                    value={clientData.processing_request_details}
                    onChange={handleInputChange}
                    placeholder="Describe your request (e.g., translation, editing, scanning, etc.)"
                    className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    aria-required="true"
                  />
                </div>
              </div>

              <MultipartFileUploader
                theme="light"
                onUploadSuccess={handleUploadSuccess}
                onFileAdded={handleFileAdded}
                onFileRemoved={handleFileRemoved}
                triggerUploadRef={triggerUploadRef}
                onUploadComplete={handleUploadComplete}
                idRequestClient={clientData.id_request_client}
              />
            </div>

            {errorMessage && (
              <div className="text-center p-4 bg-red-50 rounded-lg" role="alert">
                <p className="text-red-700 font-semibold">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={btnDisabled || saving}
              className="btn w-full text-center text-primary font-semibold transition duration-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={saving ? "Processing submission" : "Submit request"}
            >
              {saving ? "Processing..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
