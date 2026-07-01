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

  const dynamicDataStr = formData.get('dynamic_data') as string;
  let dynamic_data = {};
  if (dynamicDataStr) {
    try {
      dynamic_data = JSON.parse(dynamicDataStr);
    } catch (e) {
      console.error("Invalid dynamic_data JSON", e);
    }
  }

  const profileData = {
    id: user.id,
    role: (formData.get('role') as string)?.trim() || null,
    age: (formData.get('age') as string)?.trim() || null,
    state: (formData.get('state') as string)?.trim() || null,
    district: (formData.get('district') as string)?.trim() || null,
    annual_income: (formData.get('annual_income') as string)?.trim() || null,
    education: (formData.get('education') as string)?.trim() || null,
    course: (formData.get('course') as string)?.trim() || null,
    year: (formData.get('year') as string)?.trim() || null,
    category: (formData.get('category') as string)?.trim() || null,
    gender: (formData.get('gender') as string)?.trim() || null,
    disability: (formData.get('disability') as string)?.trim() || null,
    dynamic_data
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
