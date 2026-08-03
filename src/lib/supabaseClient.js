import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qjwivargfjbrhnoddkxc.supabase.co'
const supabaseAnonKey = 'ublishable_PjMvCBtKsD6X7qgFbkzuJQ_WJdp1_jt'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
