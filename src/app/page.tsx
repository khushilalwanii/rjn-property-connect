"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Property = {
  id: string;
  title: string;
  price: string;
  location: string;
  purpose: string;
  identity: string;
  verified: boolean;
  images: string[];
};

export default function Home() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch("/api/properties", {
          cache: "no-store",
        });

        const data: Property[] = await res.json();
        setProperties(data);
      } catch (error) {
        console.error("Failed to load properties", error);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  if (loading) {
    return (
      <main className="p-8">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">
        Properties in Rajnandgaon
      </h1>

      {properties.length === 0 ? (
        <p>No properties listed yet.</p>
      ) : (
        <div className="grid gap-6">
          {properties.map((property: Property) => (
            <div
              key={property.id}
              onClick={() =>
                router.push(`/property/${property.id}`)
              }
              className="border rounded-xl p-5 hover:shadow-lg transition cursor-pointer"
            >
              {property.images.length > 0 && (
                <img
                  src={property.images[0]}
                  alt="Property cover"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">
                  {property.title}
                </h2>

                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  {property.purpose}
                </span>
              </div>

              <p className="text-gray-600 mt-1">
                {property.location}
              </p>

              <p className="mt-2 font-bold">
                {property.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
