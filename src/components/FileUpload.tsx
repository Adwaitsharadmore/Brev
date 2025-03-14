"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(null);
  const { user } = useAuth();

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select a file to upload.");
      }

      if (!user || !user.id) {
        throw new Error("You must be logged in to upload files.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the file
      const { data } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);
      const document_url = data.publicUrl;

      // Insert record into your documents table
      const { error: insertError } = await supabase.from("documents").insert([
        {
          user_id: user.id,
          document_url,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setFilePath(document_url);
      alert("File uploaded successfully!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div>
        <label className="button primary block" htmlFor="file">
          {uploading ? "Uploading..." : "Upload File"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="file"
          disabled={uploading}
          onChange={uploadFile}
        />
      </div>

      {filePath && (
        <div>
          <h3>Uploaded File:</h3>
          <a href={filePath} target="_blank" rel="noreferrer">
            {filePath}
          </a>
        </div>
      )}
    </div>
  );
}
