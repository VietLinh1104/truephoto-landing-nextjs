'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

interface OurWorkImage {
  url: string;
}

export default function OurWorkClient() {
  const [images, setImages] = useState<OurWorkImage[]>([]);
  const [selected, setSelected] = useState<OurWorkImage | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/ourwork.json");
      const data: OurWorkImage[] = await res.json();

      // Tổng số trang
      setPageCount(Math.ceil(data.length / pageSize));

      // Lấy slice theo page hiện tại
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setImages(data.slice(start, end));
    };
    fetchData();
  }, [page]);

  return (
    <>
      {/* Grid hiển thị ảnh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelected(img)}
            className="relative w-full aspect-[4/3] overflow-hidden"
          >

            <img
              src={img.url}
              alt={`Our work ${index}`}
              className="w-full h-full object-cover rounded"
            />
          </button>
        ))}
        {images.length === 0 && (
          <p className="text-center col-span-full text-gray-500">No works found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-1">{page} / {pageCount}</span>
        <button
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal xem ảnh */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-3xl w-full p-4">
            <Image
              src={selected.url}
              alt="Selected work"
              width={1200}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain rounded shadow-lg"
            />
            <button
              className="absolute top-2 right-2 text-white bg-black/60 rounded-full px-3 py-1"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
