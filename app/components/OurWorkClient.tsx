'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchAPI } from "@/lib/api";

interface OurWorkImage {
  id: number;
  documentId: string;
  name: string;
  url: string;
}

interface OurWorkEntry {
  id: number;
  documentId: string;
  img: OurWorkImage[];
}

interface APIResponse<T> {
  data?: T;
  meta?: unknown;
}

export default function OurWorkClient() {
  const [images, setImages] = useState<OurWorkImage[]>([]);
  const [selected, setSelected] = useState<OurWorkImage | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res: APIResponse<OurWorkEntry[]> = await fetchAPI("our-works?populate=*");
      const allImages = res.data?.flatMap((item) => item.img ?? []) ?? [];
      setImages(allImages);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setSelected(img)}
            className="relative w-full aspect-[4/3] overflow-hidden"
          >
            <Image
              src={img.url}
              alt={img.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105 rounded"
            />
          </button>
        ))}
        {images.length === 0 && (
          <p className="text-center col-span-full text-gray-500">No works found.</p>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-3xl w-full p-4">
            <Image
              src={selected.url}
              alt={selected.name}
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
