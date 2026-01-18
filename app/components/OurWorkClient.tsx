'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

interface OurWorkImage {
  thumb: string;
  view: string;
}

const JSON_URL = "https://document.truediting.com/our-work/ourwork.json";
const THUMB_BASE = "https://document.truediting.com/our-work/thumb/";
const VIEW_BASE = "https://document.truediting.com/our-work/view/";

export default function OurWorkClient() {
  const [allImages, setAllImages] = useState<OurWorkImage[]>([]);
  const [images, setImages] = useState<OurWorkImage[]>([]);
  const [selected, setSelected] = useState<OurWorkImage | null>(null);

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = 12; // ✅ 4 cột × 3 dòng

  /* =========================
     FETCH JSON (1 LẦN)
     ========================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const res = await fetch(JSON_URL);
      const data: OurWorkImage[] = await res.json();

      setAllImages(data);
      setPageCount(Math.ceil(data.length / pageSize));
      setLoading(false);
    };

    fetchData();
  }, []);

  /* =========================
     PAGINATION (CLIENT SIDE)
     ========================= */
  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setImages(allImages.slice(start, end));
  }, [page, allImages]);

  return (
    <>
      {/* =========================
          GRID ẢNH (4:3)
          ========================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Skeleton */}
        {loading &&
          Array.from({ length: pageSize }).map((_, i) => (
            <div
              key={i}
              className="w-full aspect-[4/3] rounded bg-gray-200 animate-pulse"
            />
          ))}

        {/* Images */}
        {!loading &&
          images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelected(img)}
              className="group relative w-full aspect-[4/3] overflow-hidden rounded bg-black"
            >
              <img
                loading="lazy"
                src={`${THUMB_BASE}${img.thumb}`}
                alt={`Our work ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
            </button>
          ))}
      </div>

      {/* =========================
          PAGINATION (KHÔNG NHÁY)
          ========================= */}
      {pageCount > 1 && (
        <div className="flex justify-center mt-12 gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-4 py-1 text-sm">
            {page} / {pageCount}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            className="px-4 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* =========================
          MODAL XEM ẢNH
          ========================= */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-5xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`${VIEW_BASE}${selected.view}`}
              alt="Selected work"
              width={1200}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain rounded shadow-xl"
              priority
            />

            <button
              className="absolute top-3 right-3 text-white bg-black/60 rounded-full px-3 py-1"
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
