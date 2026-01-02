"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Property = {
  id: string;
  propertyCode: string;
  title: string;
  price: number;
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

  <p className="text-xs text-[var(--text-secondary)] mb-2">
    Property ID: {property.propertyCode}
  </p>

  <div
    className="
      mt-8 rounded-lg p-5
      bg-[var(--card-bg)]
      border border-[var(--card-border)]
      text-[var(--text-primary)]
    "
  >
    <p className="text-sm">
      <span className="font-semibold">Purpose:</span>{" "}
      <span className="text-[var(--text-secondary)]">
        {property.purpose}
      </span>
    </p>

    <p className="text-sm mt-2">
      <span className="font-semibold">Listed by:</span>{" "}
      <span className="text-[var(--text-secondary)]">
        {property.identity}
      </span>
    </p>

    <p className="text-sm mt-2">
      <span className="font-semibold">Status:</span>{" "}
      <span
        className={
          property.verified
            ? "text-emerald-600 dark:text-emerald-400 font-medium"
            : "text-amber-600 dark:text-amber-400 font-medium"
        }
      >
        {property.verified ? "Verified" : "Pending"}
      </span>
    </p>
  </div>

  {!property.verified && (
  <div
    className="
      mt-6 p-4 rounded-lg
      bg-amber-50 text-amber-700
      dark:bg-amber-900/30 dark:text-amber-300
      text-sm
    "
  >
    ⚠ This property is pending verification. Please verify details
    independently before making any payments.
  </div>
)}



      <p className="mt-6 text-xs text-gray-500">
        All properties are reviewed and verified offline.
      </p>
    </main>
  );
}
