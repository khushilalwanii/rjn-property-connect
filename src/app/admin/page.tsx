"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Property = {
  id: string;
  propertyCode: string;
  title: string;
  location: string;
  purpose: string;
  verified: boolean;
};

export default function AdminPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Admin check + fetch properties
  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (
        !user ||
        user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
      ) {
        alert("Unauthorized access");
        router.push("/");
        return;
      }

      const res = await fetch("/api/admin/properties");
      const data: Property[] = await res.json();
      setProperties(data);
      setLoading(false);
    }

    init();
  }, [router]);

  // ✅ Verify property
  async function verifyProperty(id: string) {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, verified: true } : p
        )
      );
    } else {
      alert("Failed to verify property");
    }
  }

  // ❌ Delete property
  async function deleteProperty(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this property?"
    );

    if (!confirmDelete) return;

    const res = await fetch("/api/admin/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setProperties((prev) =>
        prev.filter((p) => p.id !== id)
      );
    } else {
      alert("Failed to delete property");
    }
  }

  if (loading) {
    return (
      <main className="p-8">
        <p>Loading admin panel…</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Admin Verification Panel
      </h1>

      {properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="
                flex flex-col sm:flex-row sm:items-center
                justify-between gap-4
                p-5 rounded-xl
                border border-[var(--card-border)]
                bg-[var(--card-bg)]
              "
            >
              {/* PROPERTY INFO */}
              <div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Property ID: {property.propertyCode}
                </p>

                <p className="font-semibold text-[var(--text-primary)]">
                  {property.title}
                </p>

                <p className="text-sm text-[var(--text-secondary)]">
                  {property.location} • {property.purpose}
                </p>

                <p className="text-sm mt-1">
                  Status:{" "}
                  <span
                    className={
                      property.verified
                        ? "text-emerald-600 font-medium"
                        : "text-amber-600 font-medium"
                    }
                  >
                    {property.verified
                      ? "Verified"
                      : "Pending"}
                  </span>
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                {!property.verified && (
                  <button
                    onClick={() =>
                      verifyProperty(property.id)
                    }
                    className="
                      px-4 py-2 rounded-lg
                      bg-emerald-600 text-white
                      hover:opacity-90 transition
                    "
                  >
                    Verify
                  </button>
                )}

                <button
                  onClick={() =>
                    deleteProperty(property.id)
                  }
                  className="
                    px-4 py-2 rounded-lg
                    bg-red-600 text-white
                    hover:opacity-90 transition
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
