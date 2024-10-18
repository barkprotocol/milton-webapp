const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]
  
  export function checkEnvVars(): boolean {
    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    )
  
    if (missingEnvVars.length > 0) {
      console.error('Missing required environment variables:')
      missingEnvVars.forEach((envVar) => {
        console.error(`- ${envVar}`)
      })
      return false
    }
  
    return true
  }
  
  export const hasEnvVars = checkEnvVars()