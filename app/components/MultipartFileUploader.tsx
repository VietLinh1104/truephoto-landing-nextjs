// File: components/MultipartFileUploader.tsx
import React from "react";
import Uppy, { type UploadResult, UppyFile } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import AwsS3Multipart, { AwsS3Part } from "@uppy/aws-s3-multipart";
import { create } from "@/lib/strapiClient";

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

interface StorageBucketData {
  data: {
    fileName: string;
    key: string;
    bucket: string;
    uploadId: string | null;
    versionId: string | null;
    etag: string | null;
    checksumCRC32: string | null;
    url: string;
    size: number;
    mimeType: string;
    statusUpload: "completed" | "pending" | "failed";
  };
}

// Extend UploadResult to include documentId
interface ExtendedUploadResult extends UploadResult {
  documentId?: string;
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

  return res.json();
};

const createStorageBucket = async (data: StorageBucketData) => {
  try {
    // Format data according to Strapi's expected structure
    const strapiData = {
      data: {
        fileName: data.data.fileName,
        key: data.data.key,
        bucket: data.data.bucket,
        uploadId: data.data.uploadId,
        versionId: data.data.versionId,
        etag: data.data.etag,
        checksumCRC32: data.data.checksumCRC32,
        url: data.data.url,
        size: data.data.size,
        mimeType: data.data.mimeType,
        statusUpload: data.data.statusUpload
      }
    };

    console.log('Sending to Strapi:', JSON.stringify(strapiData, null, 2));
    const response = await create('storage-buckets', strapiData);
    return response;
  } catch (error) {
    console.error('Error saving to Strapi:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
};

export function MultipartFileUploader({
  onUploadSuccess,
  theme = "dark",
}: {
  onUploadSuccess: (result: UploadResult) => void;
  theme?: "light" | "dark";
}) {
  const uppy = React.useMemo(() => {
    const uppy = new Uppy({
      autoProceed: true,
    }).use(AwsS3Multipart, {
      createMultipartUpload: async (file) => {
        const contentType = file.type;
        return fetchUploadApiEndpoint("create-multipart-upload", {
          file: { name: file.name },
          contentType,
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

    return uppy;
  }, []);

  React.useEffect(() => {
    uppy.on("complete", async (result) => {
      try {
        const uploadedFile = result.successful[0] as ExtendedUppyFile;
        
        if (!uploadedFile.response?.body?.Key || !uploadedFile.response.body.Bucket) {
          throw new Error('Missing required file data');
        }
        
        const strapiData: StorageBucketData = {
          data: {
            fileName: uploadedFile.name,
            key: uploadedFile.response.body.Key,
            bucket: uploadedFile.response.body.Bucket,
            uploadId: uploadedFile.uploadId || null,
            versionId: uploadedFile.response.body.VersionId || null,
            etag: (uploadedFile.response.body.ETag || '').replace(/"/g, '') || null,
            checksumCRC32: uploadedFile.response.body.ChecksumCRC32 || null,
            url: uploadedFile.uploadURL || '',
            size: uploadedFile.size,
            mimeType: uploadedFile.type || 'application/octet-stream',
            statusUpload: "completed"
          }
        };

        const response = await createStorageBucket(strapiData);
        console.log('Successfully saved to Strapi:', response);
        if (response?.documentId) {
          onUploadSuccess({ ...result, documentId: response.documentId } as ExtendedUploadResult);
        } else {
          console.error('Missing documentId in response:', response);
          onUploadSuccess(result);
        }
      } catch (error) {
        console.error('Error in upload completion:', error);
        // You might want to show an error message to the user here
      }
    });

    uppy.on("upload-success", (file, response) => {
      if (!file) return;
    
      const key = response.body?.Key;
      const publicBaseURL = "https://document.truediting.com";
      const publicURL = `${publicBaseURL}/${key}`;
    
      uppy.setFileState(file.id, {
        ...uppy.getState().files[file.id],
        uploadURL: publicURL,
        response,
      });
    });
    
    return () => uppy.close();
  }, [uppy, onUploadSuccess]);

  return <Dashboard 
    uppy={uppy} 
    showLinkToFileUploadResult={true} 
    theme={theme}
    className="!border-none shadow-none"
  />;
}
