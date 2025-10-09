import { createClient } from '@supabase/supabase-js'

// Substitua pelos dados do seu projeto Supabase
const supabaseUrl = 'https://SEU_PROJETO.supabase.co'
const supabaseAnonKey = 'SUA_CHAVE_ANON_PUBLICA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
