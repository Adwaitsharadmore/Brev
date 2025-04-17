"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ClientUploadProps {
  userId: string;
}

export default function ClientUploadComponent({ userId }: ClientUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string>("");

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setMessage("No file selected.");
      return;
    }

    const sanitizedFileName = selectedFile.name.replace(
      /[^a-zA-Z0-9_.-]/g,
      "_"
    );
    const filePath = `${userId}/${crypto.randomUUID()}-${sanitizedFileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setMessage(`❌ Failed to upload: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: dbError } = await supabase.from("users_documents").insert({
        id: crypto.randomUUID(),
        user_id: userId,
        document_url: publicUrl,
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error("Database error:", dbError);
        setMessage(`❌ Metadata save failed: ${dbError.message}`);
        return;
      }

      setMessage("✅ File uploaded successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("⚠️ Unexpected error occurred.");
    }
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        className="bg-white text-black px-4 py-2 rounded-full hover:bg-[#0023FF] hover:text-white transition-colors"
        onClick={triggerFileSelect}
      >
        Upload File
      </button>
      {message && (
        <p className="mt-4 text-sm text-white font-medium">{message}</p>
      )}
    </div>
  );
}
