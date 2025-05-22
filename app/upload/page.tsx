'use client';

import React from 'react';
import { MultipartFileUploader } from '../components/MultipartFileUploader';
import type { UploadResult } from '@uppy/core';
import Link from 'next/link';

export default function UploadPage() {
  const handleUploadSuccess = (result: UploadResult) => {
    console.log('Upload successful:', result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="upload-page mx-auto max-w-7xl space-y-6 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="text-gray-700 hover:text-blue-600">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-500">Document</span>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-500 font-medium">Upload Document</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="text-2xl font-semibold mt-2">Upload Files</h1>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <MultipartFileUploader onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>
    </div>
  );
} 