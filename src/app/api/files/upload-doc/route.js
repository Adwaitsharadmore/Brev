import { IncomingForm } from "formidable";
import fs from "fs/promises";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const form = new IncomingForm();
    form.uploadDir = "../uploads"; // Adjust path as needed
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing file" });
      }

      const file = files.document;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileData = await fs.readFile(file.filepath);
      const fileName = `${fields.user_id}-${Date.now()}-${file.originalFilename}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("documents")
        .upload(`users/${fields.user_id}/${fileName}`, fileData);

      if (error) {
        return res.status(500).json({ error: "Upload failed" });
      }

      // Insert record into database
      const { error: dbError } = await supabase.from("user_documents").insert([
        {
          user_id: fields.user_id,
          document_url: data.path,
          created_at: new Date().toISOString(),
        },
      ]);

      if (dbError) {
        return res.status(500).json({ error: "Database insert failed" });
      }

      return res.status(200).json({
        message: "File uploaded successfully",
        url: data.path,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
