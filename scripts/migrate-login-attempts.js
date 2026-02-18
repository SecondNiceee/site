import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
  // 1. Create login_attempts table
  const { error: tableError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS login_attempts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ip_address TEXT NOT NULL,
        username TEXT,
        attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        success BOOLEAN DEFAULT FALSE
      );
      CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address, attempted_at);
    `
  });

  if (tableError) {
    // Try direct insert approach - table might already exist or RPC not available
    // Let's try creating via REST by checking if the table exists
    const { error: checkError } = await supabase.from('login_attempts').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      console.log('Table does not exist and cannot create via RPC. Please run the SQL manually in Supabase Dashboard:');
      console.log(`
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  username TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  success BOOLEAN DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address, attempted_at);
      `);
    } else if (!checkError) {
      console.log('login_attempts table already exists!');
    } else {
      console.log('Error checking table:', checkError.message);
    }
  } else {
    console.log('login_attempts table created successfully!');
  }

  // 2. Check if show_address setting exists, add default if not
  const { data: settings } = await supabase.from('site_settings').select('*');
  console.log('Current settings:', settings);

  // Add show_address if not present
  const hasShowAddress = settings?.some(s => s.key === 'show_address');
  if (!hasShowAddress) {
    const { error } = await supabase.from('site_settings').insert({ key: 'show_address', value: 'true' });
    if (error) console.log('Error adding show_address:', error.message);
    else console.log('Added show_address setting (default: true)');
  }

  // Add show_documents if not present
  const hasShowDocuments = settings?.some(s => s.key === 'show_documents');
  if (!hasShowDocuments) {
    const { error } = await supabase.from('site_settings').insert({ key: 'show_documents', value: 'true' });
    if (error) console.log('Error adding show_documents:', error.message);
    else console.log('Added show_documents setting (default: true)');
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
