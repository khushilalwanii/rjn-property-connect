"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";


export default function AddProperty() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/");
      }
    });
  }, [router]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [purpose, setPurpose] = useState("");
  const [identity, setIdentity] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function uploadImages(files: FileList) {
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.7,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      });

      const formData = new FormData();
      formData.append("file", compressed);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      urls.push(data.url);
    }

    return urls;
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  try {
    // 🔐 STEP 1: Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to add a property");
      setLoading(false);
      return;
    }

    // 🖼️ STEP 2: Upload images
    let imageUrls: string[] = [];

    if (images) {
      imageUrls = await uploadImages(images);
    }

    // 📦 STEP 3: Send property + userId to backend
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        price,
        location,
        purpose,
        identity,
        description,
        images: imageUrls,
        userId: user.id, // 👈 THIS IS THE KEY LINE
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save property");
    }

    router.push("/");
  } catch (error) {
    alert("Failed to submit property");
  } finally {
    setLoading(false);
  }
}


  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">
        List / Sell Property
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border p-3 rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="w-full border p-3 rounded" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input className="w-full border p-3 rounded" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <select className="w-full border p-3 rounded" value={purpose} onChange={(e) => setPurpose(e.target.value)} required>
          <option value="">Purpose</option>
          <option value="SELL">Sell</option>
          <option value="RENT">Rent</option>
        </select>

        <select className="w-full border p-3 rounded" value={identity} onChange={(e) => setIdentity(e.target.value)} required>
          <option value="">Identity</option>
          <option>Owner</option>
          <option>Agent</option>
          <option>Broker</option>
          <option>Developer</option>
        </select>

        <textarea className="w-full border p-3 rounded" rows={4} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            setImages(files);

            if (files) {
              const previews = Array.from(files).map((file) =>
                URL.createObjectURL(file)
              );
              setPreviewUrls(previews);
            }
          }}
        />

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-lg border"
              />
            ))}
          </div>
        )}



        <button disabled={loading} className="bg-black text-white px-6 py-3 rounded">
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
