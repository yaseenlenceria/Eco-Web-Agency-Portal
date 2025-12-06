import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseDebug: React.FC = () => {
  const [status, setStatus] = useState<string>('Checking...');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      // Check if we can reach Supabase
      const { data, error } = await supabase.from('profiles').select('count').single();

      if (error) {
        setStatus('❌ Connection Failed');
        setDetails({
          error: error.message,
          hint: 'Table might not exist yet. Run the SQL schema in Supabase dashboard.'
        });
      } else {
        setStatus('✅ Connected to Supabase');
        setDetails({
          message: 'Database connection successful',
          profilesCount: data.count
        });
      }
    } catch (err: any) {
      setStatus('❌ Error');
      setDetails({
        error: err.message,
        url: supabase.supabaseUrl,
        hasKey: !!supabase.supabaseKey
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-lg font-semibold mb-2">Supabase Status</h3>
      <div className={`p-3 rounded ${status.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {status}
      </div>
      {details && (
        <div className="mt-2 p-3 bg-gray-100 rounded text-sm">
          <pre className="whitespace-pre-wrap">{JSON.stringify(details, null, 2)}</pre>
        </div>
      )}
      <button
        onClick={checkSupabaseConnection}
        className="mt-3 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm"
      >
        Recheck Connection
      </button>
    </div>
  );
};

export default SupabaseDebug;