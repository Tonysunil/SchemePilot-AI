'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to save your profile')
  }

  const profileData = {
    id: user.id,
    state: (formData.get('state') as string)?.trim(),
    education: (formData.get('education') as string)?.trim(),
    course: (formData.get('course') as string)?.trim(),
    year: (formData.get('year') as string)?.trim(),
    annual_income: (formData.get('annual_income') as string)?.trim(),
    category: (formData.get('category') as string)?.trim() || null,
    gender: (formData.get('gender') as string)?.trim() || null,
    disability: (formData.get('disability') as string)?.trim() || null,
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(profileData)

  if (error) {
    console.error('Error saving profile:', error)
    throw new Error('Failed to save profile. Make sure the database table exists!')
  }

  revalidatePath('/dashboard/profile')
  revalidatePath('/chat')
  redirect('/dashboard/profile?updated=true')
}
