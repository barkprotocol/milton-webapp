import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

const supabase = createClientComponentClient<Database>()

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<Database['public']['Tables']['profiles']['Row']>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    return null
  }

  return data
}

export async function getMiltonBalance(userId: string) {
  const { data, error } = await supabase
    .from('milton_balances')
    .select('balance')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching Milton balance:', error)
    return null
  }

  return data?.balance || 0
}

export async function getTransactions(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return data
}

export async function createTransaction(transaction: Omit<Database['public']['Tables']['transactions']['Insert'], 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single()

  if (error) {
    console.error('Error creating transaction:', error)
    return null
  }

  return data
}

export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('milton_balances')
    .select('user_id, balance, profiles(username)')
    .order('balance', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }

  return data
}