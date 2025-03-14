import { withAuth } from "@workos-inc/authkit-nextjs";
import { supabase } from "../../../lib/supabase";
import { NextResponse } from "next/server";

export const POST = withAuth(async (req, { user }) => {
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user_id = user.id; // Authenticated User ID from AuthKit
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `${user_id}/${Date.now()}.${fileExt}`;

  // Convert file to buffer
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME)
    .upload(filePath, fileBuffer, { cacheControl: "3600", upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME)
    .getPublicUrl(filePath);

  // Save file info to Supabase database
  const { error: dbError } = await supabase.from("documents").insert([
    {
      user_id,
      document_url: publicUrlData.publicUrl,
    },
  ]);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ document_url: publicUrlData.publicUrl }, { status: 200 });
});
