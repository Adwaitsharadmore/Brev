"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface DocumentListProps {
  userId: string;
}

interface Document {
  id: string;
  document_url: string;
  created_at: string;
  user_id: string;
}

export default function DocumentListClient({ userId }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      console.log("Fetching documents for userId:", userId);

      const { data: documentsData, error: fetchError } = await supabase
        .from("users_documents")
        .select("*")
        .eq("user_id", userId);

      console.log("Fetched documents:", documentsData);
      console.log("Fetch error:", fetchError);

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setDocuments(documentsData || []);
      }

      setLoading(false);
    };

    if (userId) fetchDocuments();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (documents.length === 0) {
    return <p>No documents found.</p>;
  }

  return (
    <div className="container mx-auto mt-8 max-w-[560px]">
      <h1 className="text-3xl font-semibold mb-4">Your Uploaded Documents</h1>
      <ul className="list-disc pl-5">
        {documents.map((doc) => (
          <li key={doc.id} className="mb-4">
            <RenderDocument documentUrl={doc.document_url} />
            <p className="text-gray-500 text-sm">
              <strong>Document URL:</strong> {doc.document_url}
            </p>
            <p className="text-gray-500 text-sm">
              <strong>Uploaded on:</strong>{" "}
              {new Date(doc.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Utility function to get file extension
function getFileExtension(documentUrl: string): string {
  const lastDotIndex = documentUrl.lastIndexOf(".");
  if (lastDotIndex === -1) return "";
  return documentUrl.slice(lastDotIndex + 1).toLowerCase();
}

// Subcomponent to render the document preview or link
function RenderDocument({ documentUrl }: { documentUrl: string }) {
  const fileExtension = getFileExtension(documentUrl);

  if (fileExtension === "pdf") {
    return (
      <iframe
        src={documentUrl}
        className="w-full h-[600px] border"
        title="PDF Viewer"
      ></iframe>
    );
  }

  if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
    return (
      <img
        src={documentUrl}
        alt="Uploaded document"
        className="max-w-full rounded border"
      />
    );
  }

  if (fileExtension === "txt") {
    const [content, setContent] = useState<string | null>(null);

    useEffect(() => {
      const fetchTextFile = async () => {
        try {
          const response = await fetch(documentUrl);
          const text = await response.text();
          setContent(text);
        } catch (error) {
          console.error("Error fetching text file:", error);
          setContent("Failed to load text content.");
        }
      };

      fetchTextFile();
    }, [documentUrl]);

    return (
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
        {content || "Loading text file..."}
      </pre>
    );
  }

  return (
    <a
      href={documentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      Download Document
    </a>
  );
}
