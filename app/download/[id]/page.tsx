"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Download, FileText } from "lucide-react";
import { fetchAPI } from "../../../lib/api"; // Cập nhật đường dẫn đúng

// Định nghĩa kiểu dữ liệu của file đính kèm
interface FileData {
  id: string | number;
  name: string;
  mime: string;
  size: number;
  url: string;
}

// Kiểu dữ liệu chính của API trả về
interface Data {
  name: string;
  email: string;
  note?: string;
  createdAt: string;
  publishedAt: string;
  document?: FileData[];
}

// Kiểu dữ liệu API trả về, data có thể undefined nếu lỗi hoặc không có dữ liệu
interface APIResponse<T> {
  data?: T;
  error?: string;
}

export default function DownloadForm() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams(); // Lấy id từ URL

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result: APIResponse<Data> = await fetchAPI(
          `client-submission-results/${id}?populate=*`
        );

        if (result.error) {
          setError(result.error);
          setData(null);
        } else if (result.data) {
          setData(result.data);
        } else {
          setError("No data found");
          setData(null);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching the data.";
        setError(errorMessage);
        setData(null);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const formatDate = (str: string) =>
    new Date(str).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found.</div>;

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 rounded-2xl shadow-xl bg-white border border-gray-200">
      <h1 className="text-3xl font-bold text-primary mb-6">Download Information</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8 text-sm text-gray-700">
        <div>
          <p>
            <span className="font-semibold">Name:</span> {data.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {data.email}
          </p>
          {data.note && (
            <p>
              <span className="font-semibold">Note:</span> {data.note}
            </p>
          )}
        </div>
        <div>
          <p>
            <span className="font-semibold">Created at:</span> {formatDate(data.createdAt)}
          </p>
          <p>
            <span className="font-semibold">Published at:</span> {formatDate(data.publishedAt)}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Attached Files</h2>
        <div className="space-y-4">
          {data.document && data.document.length > 0 ? (
            data.document.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-6 h-6 text-gray-500" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {file.mime} — {file.size} KB
                    </p>
                  </div>
                </div>
                <a
                  href={file.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            ))
          ) : (
            <p>No files attached.</p>
          )}
        </div>
      </div>
    </div>
  );
}
