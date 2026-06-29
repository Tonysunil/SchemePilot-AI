'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveScheme(schemeTitle: string, category?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }

  // Check if scheme is already saved to prevent duplicates
  const { data: existing } = await supabase
    .from('saved_schemes')
    .select('id')
    .eq('user_id', user.id)
    .eq('scheme_title', schemeTitle)
    .single()

  if (existing) {
    return { success: true }
  }

  const { error } = await supabase
    .from('saved_schemes')
    .insert({ user_id: user.id, scheme_title: schemeTitle, category })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/saved')
  return { success: true }
}

export async function removeScheme(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('saved_schemes').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/saved')
  return { success: true }
}

export async function bulkAddChecklistItems(tasks: string[]) {
  if (!tasks || tasks.length === 0) return { error: 'Tasks are required' };

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }

  const insertData = tasks.map(task => ({
    user_id: user.id,
    task
  }));

  const { error } = await supabase
    .from('checklist_items')
    .insert(insertData)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/checklist')
  return { success: true }
}

export async function addChecklistItem(formData: FormData) {
  const task = formData.get('task') as string;
  if (!task) return { error: 'Task is required' };

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }

  const { error } = await supabase
    .from('checklist_items')
    .insert({ user_id: user.id, task })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/checklist')
  return { success: true }
}

export async function toggleChecklistItem(id: string, is_completed: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('checklist_items')
    .update({ is_completed: !is_completed })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/checklist')
  return { success: true }
}

export async function removeChecklistItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('checklist_items').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/checklist')
  return { success: true }
}
