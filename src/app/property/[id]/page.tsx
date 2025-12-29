"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Property = {
  id: string;
  title: string;
  price: string;
  location: string;
  purpose: string;
  identity: string;
  verified: boolean;
  description: string;
  images: string[];
};

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetch("/api/properties", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Property[]) => {
        const found = data.find((p) => p.id === id);
        setProperty(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="p-8">
        <p>Loading property...</p>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold">
          Property not found
        </h1>
        <p className="mt-2 text-gray-600">
          The property you are looking for does not exist.
        </p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold">
        {property.title}
      </h1>

      <p className="text-gray-600 mt-1">
        {property.location}
      </p>

      <p className="text-2xl font-bold mt-4">
        {property.price}
      </p>

      <p className="mt-6 text-gray-700">
        {property.description}
      </p>

      {/* Images */}
      {property.images.length > 0 && (
        <div className="mt-6 relative">
          {/* Main Image */}
          <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl border">
            <img
              src={property.images[currentImage]}
              alt={`Property image ${currentImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

      {/* Left Arrow */}
      {property.images.length > 1 && (
        <button
          onClick={() =>
            setCurrentImage(
              currentImage === 0
                ? property.images.length - 1
                : currentImage - 1
            )
          }
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
        >
          ◀
        </button>
      )}

      {/* Right Arrow */}
      {property.images.length > 1 && (
        <button
          onClick={() =>
            setCurrentImage(
              currentImage === property.images.length - 1
                ? 0
                : currentImage + 1
            )
          }
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
        >
          ▶
        </button>
      )}

      {/* Dots */}
      {property.images.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 w-2 rounded-full ${
                currentImage === index
                  ? "bg-black"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )}


      <div className="mt-8 border rounded-lg p-4 bg-gray-50">
        <p className="text-sm">
          <strong>Purpose:</strong>{" "}
          {property.purpose}
        </p>
        <p className="text-sm mt-1">
          <strong>Listed by:</strong>{" "}
          {property.identity}
        </p>
        <p className="text-sm mt-1">
          <strong>Status:</strong>{" "}
          {property.verified ? "Verified" : "Pending"}
        </p>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        All properties are reviewed and verified offline.
      </p>
    </main>
  );
}
