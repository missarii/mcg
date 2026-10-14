import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zmbptrblkpdvfbbvpnsy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptYnB0cmJsa3BkdmZiYnZwbnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MTAyMDcsImV4cCI6MjA3ODE4NjIwN30.oNIrdPn47ZhRFMtbDo-kxwtB8UDQeCg5veLP7d77Rgk';

export const supabase = createClient(supabaseUrl, supabaseKey);
