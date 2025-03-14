// pages/api/upload.js
import { supabase } from '../../lib/supabase';
import { getSession } from 'next-auth/react'; // Assuming AuthKit uses next-auth

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req }); // Get user session
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user_id = session.user.id; // Get user ID from AuthKit
  const file = req.body.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `${user_id}/${Date.now()}.${fileExt}`;

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Construct document URL
  const { publicURL } = supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME)
    .getPublicUrl(filePath);

  // Store metadata in the database
  const { data: dbData, error: dbError } = await supabase
    .from('documents')
    .insert([{ user_id, document_url: publicURL }]);

  if (dbError) {
    return res.status(500).json({ error: dbError.message });
  }

  res.status(200).json({ document_url: publicURL });
}
