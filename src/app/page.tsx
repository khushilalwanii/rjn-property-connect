"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Property = {
  id: string;
  propertyCode: string;
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
        const res = await fetch("/api/properties", { cache: "no-store" });
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
      <main className="p-8 max-w-6xl mx-auto">
        <p className="text-[var(--text-secondary)]">Loading properties…</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 text-[var(--text-primary)]">
        Properties in Rajnandgaon
      </h1>

      {properties.length === 0 ? (
        <p className="text-[var(--text-secondary)]">
          No properties listed yet.
        </p>
      ) : (
        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {properties.map((property) => (
            <div
              key={property.id}
              onClick={() => router.push(`/property/${property.id}`)}
              className="
                group flex flex-col overflow-hidden
                rounded-2xl cursor-pointer
                bg-[var(--card-bg)]
                border border-[var(--card-border)]
                transition
                hover:shadow-xl
              "
            >
              {/* IMAGE */}
              {property.images.length > 0 && (
                <div className="overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt="Property cover"
                    className="
                      w-full h-48 object-cover
                      transition-transform duration-300
                      group-hover:scale-105
                    "
                  />
                </div>
              )}

              {/* CONTENT */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                {/* TITLE + PURPOSE */}
                <div className="flex justify-between items-start gap-3">
                  <h2 className="text-lg font-semibold leading-snug text-[var(--text-primary)]">
                    {property.title}
                  </h2>

                  {property.verified && (
                    <span
                      className="
                        text-xs px-2 py-1 rounded-full
                        bg-emerald-100 text-emerald-700
                        dark:bg-emerald-900/40 dark:text-emerald-300
                        font-medium
                      "
                    >
                      ✔ Verified
                    </span>
                  )}
                  <span
                    className={`
                      text-xs px-3 py-1 rounded-full font-medium
                      ${
                        property.purpose === "SELL"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      }
                    `}
                  >
                    {property.purpose}
                  </span>
                </div>

                {/* LOCATION */}
                <p className="text-sm text-[var(--text-secondary)]">
                  📍 {property.location}
                </p>

                {/* PRICE */}
                <p className="mt-auto text-xl font-bold text-[var(--accent)]">
                  {property.price}
                </p>

                {/* VERIFIED */}
                <p className="text-sm mt-2">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={
                      property.verified
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-amber-600 dark:text-amber-400 font-medium"
                    }
                  >
                    {property.verified
                      ? "Verified by Trust Property"
                      : "Pending verification"}
                  </span>
                </p>

              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
