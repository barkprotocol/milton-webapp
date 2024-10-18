declare module '@supabase/auth-helpers-nextjs' {
    import { User } from '@supabase/supabase-js'
    
    export function createClientComponentClient<T>(): T
    // Add other type declarations as needed
  }