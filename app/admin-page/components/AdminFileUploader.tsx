'use client';

import React, { useRef, useEffect } from "react";
import Uppy, { type UploadResult, UppyFile } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import AwsS3Multipart, { AwsS3Part } from "@uppy/aws-s3-multipart";
import { createDocument } from "@/lib/client";
import type { Document } from "@/lib/client";

// Import Uppy styles
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

interface UploadApiRequest {
  file?: { name: string };
  contentType?: string;
  key?: string;
  uploadId?: string;
  partNumber?: number;
  parts?: AwsS3Part[];
}

interface ExtendedUppyFile extends UppyFile {
  uploadId?: string;
  response?: {
    body: {
      Key?: string;
      Bucket?: string;
      VersionId?: string;
      ETag?: string;
      ChecksumCRC32?: string;
    };
    status: number;
    uploadURL: string;
  };
  uploadURL?: string;
}

interface AdminFileUploaderProps {
  onUploadSuccess?: (document: Document) => void;
  onUploadError?: (error: Error) => void;
  onFileAdded?: (file: UppyFile) => void;
  onFileRemoved?: (file: UppyFile) => void;
  triggerUploadRef?: React.MutableRefObject<(() => Promise<void>) | null>;
  idRequestClient?: string | null;
  idDeliverablesDocument?: string | null;
}

const fetchUploadApiEndpoint = async (endpoint: string, data: UploadApiRequest) => {
  const res = await fetch(`/api/multipart-upload/${endpoint}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error: ${res.status} - ${err}`);
  }

  const response = await res.json();
  return response;
};

const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9.]/g, "-");
  return `${timestamp}-${sanitizedOriginalName}`;
};

export function AdminFileUploader({ 
  onUploadSuccess, 
  onUploadError,
  onFileAdded,
  onFileRemoved,
  triggerUploadRef,
  idRequestClient = null,
  idDeliverablesDocument = null,
}: AdminFileUploaderProps) {
  const uppyRef = useRef<Uppy | null>(null);

  if (!uppyRef.current) {
    uppyRef.current = new Uppy({
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 10,
        maxFileSize: 100 * 1024 * 1024, // 100MB
      },
    }).use(AwsS3Multipart, {
      createMultipartUpload: (file) => {
        const uniqueName = generateUniqueFileName(file.name);
        file.meta.name = uniqueName;

        return fetchUploadApiEndpoint("create-multipart-upload", {
          file: { name: uniqueName },
          contentType: file.type,
          key: uniqueName,
        });
      },
      listParts: (file, props) =>
        fetchUploadApiEndpoint("list-parts", {
          key: props.key,
          uploadId: props.uploadId,
        }),
      signPart: (file, props) =>
        fetchUploadApiEndpoint("sign-part", {
          key: props.key,
          uploadId: props.uploadId,
          partNumber: props.partNumber,
        }),
      completeMultipartUpload: (file, props) =>
        fetchUploadApiEndpoint("complete-multipart-upload", {
          key: props.key,
          uploadId: props.uploadId,
          parts: props.parts,
        }),
      abortMultipartUpload: (file, props) =>
        fetchUploadApiEndpoint("abort-multipart-upload", {
          key: props.key,
          uploadId: props.uploadId,
        }),
    });
  }

  const uppy = uppyRef.current;

  useEffect(() => {
    const onComplete = async (result: UploadResult) => {
      try {
        for (const uploadedFile of result.successful) {
          const file = uploadedFile as ExtendedUppyFile;
          
          if (!file.response?.body?.Key || !file.response.body.Bucket) {
            throw new Error('Missing required file data');
          }

          // Tạo URL công khai từ key
          const publicBaseURL = "https://document.truediting.com";
          const publicURL = `${publicBaseURL}/${file.response.body.Key}`;

          const documentData: Document = {
            file_name: file.name,
            key: file.response.body.Key,
            bucket_name: file.response.body.Bucket,
            document_url: publicURL,
            size: file.size,
            mine_type: file.type || 'application/octet-stream',
            status_upload: "success",
          };

          // Thêm id_request_client hoặc id_deliverables_document nếu có
          if (idRequestClient) {
            documentData.id_request_client = idRequestClient;
          }
          if (idDeliverablesDocument) {
            documentData.id_deliverables_document = idDeliverablesDocument;
          }

          // Lưu vào database
          const response = await createDocument(documentData);
          
          if (onUploadSuccess && response.data) {
            onUploadSuccess(response.data as Document);
          }
        }

        // Clear files after successful upload
        uppy.getFiles().forEach(file => uppy.removeFile(file.id));
      } catch (error) {
        console.error('Error in upload completion:', error);
        if (onUploadError) {
          onUploadError(error instanceof Error ? error : new Error('Upload failed'));
        }
      }
    };

    const handleFileAdded = (file: UppyFile) => {
      onFileAdded?.(file);
    };

    const handleFileRemoved = (file: UppyFile) => {
      onFileRemoved?.(file);
    };

    uppy.on("file-added", handleFileAdded);
    uppy.on("file-removed", handleFileRemoved);
    uppy.on("complete", onComplete);

    return () => {
      uppy.off("file-added", handleFileAdded);
      uppy.off("file-removed", handleFileRemoved);
      uppy.off("complete", onComplete);
    };
  }, [uppy, onUploadSuccess, onUploadError, onFileAdded, onFileRemoved, idRequestClient, idDeliverablesDocument]);

  useEffect(() => {
    if (triggerUploadRef) {
      triggerUploadRef.current = async () => {
        await uppy.upload();
      };
    }
  }, [triggerUploadRef, uppy]);

  return (
    <Dashboard
      uppy={uppy}
      showLinkToFileUploadResult={true}
      theme="light"
      className="!border-none shadow-none"
      height={400}
      note="Images or video up to 100MB"
      hideUploadButton={!!triggerUploadRef}
    />
  );
}

