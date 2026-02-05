import { createClient } from "@/lib/supabase/server";

export default async function DbStatusPage() {
  const supabase = await createClient();
  
  // We try to fetch the 'employees' table you mentioned earlier
  const { data, error } = await supabase.from('employees').select('*').limit(1);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Status</h1>
      
      {error ? (
        <div className="p-4 bg-red-950/30 border border-red-500 rounded-lg text-red-200">
          <p className="font-bold">❌ Connection Error</p>
          <p className="text-sm opacity-80">{error.message}</p>
          <p className="mt-2 text-xs font-mono text-red-400">
            Check if the "employees" table exists in your Supabase dashboard.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-emerald-950/30 border border-emerald-500 rounded-lg text-emerald-200">
          <p className="font-bold">✅ Database Connected!</p>
          <p className="text-sm opacity-80">
            Successfully communicated with: {process.env.NEXT_PUBLIC_SUPABASE_URL}
          </p>
          <p className="mt-2 text-xs">
            Query returned {data?.length || 0} rows from the "employees" table.
          </p>
        </div>
      )}
    </div>
  );
}