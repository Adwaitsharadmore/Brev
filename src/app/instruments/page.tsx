import { createClient } from "../../app/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Instruments() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const { data: instruments } = await supabase.from("instruments").select();

  return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
}
