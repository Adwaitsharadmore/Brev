"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ClientUploadProps {
  userId: string;
}

export default function ClientUploadComponent({ userId }: ClientUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleUpload = async () => {
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
        setMessage(`Failed to upload file: ${uploadError.message}`);
        return;
      }

      // Get public URL
      const { data } = supabase.storage
        .from("documents")
            .getPublicUrl(filePath);
        console.log(data);

        const publicUrl = data.publicUrl;
        console.log(publicUrl);

      // Save file metadata
      const { error: dbError } = await supabase.from("users_documents").insert({
        id: crypto.randomUUID(),
        user_id: userId,
        document_url: publicUrl,
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error("Database error:", dbError);
        setMessage(`Failed to save file metadata: ${dbError.message}`);
        return;
      }

      setMessage("File uploaded successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred while uploading.");
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        className="my-4"
      />
      <button
        className="mt-5 bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
        type="button"
        onClick={handleUpload}
      >
        Upload File
      </button>
      {message && <p className="my-5 text-green-600">{message}</p>}
    </>
  );
}
