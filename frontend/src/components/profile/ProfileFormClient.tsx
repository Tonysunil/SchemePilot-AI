'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { saveProfile } from '@/app/actions/profile';
import { Save, Loader2, GraduationCap, Leaf, Briefcase, User, Building2, Heart, Accessibility, Home, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
  { id: 'Student', icon: GraduationCap, label: 'Student' },
  { id: 'Farmer', icon: Leaf, label: 'Farmer' },
  { id: 'Job Seeker', icon: Briefcase, label: 'Job Seeker' },
  { id: 'Senior Citizen', icon: User, label: 'Senior Citizen' },
  { id: 'Entrepreneur', icon: Building2, label: 'Entrepreneur' },
  { id: 'Woman', icon: Heart, label: 'Woman' },
  { id: 'Person with Disability', icon: Accessibility, label: 'Person with Disability' },
  { id: 'Homemaker', icon: Home, label: 'Homemaker' },
  { id: 'Other', icon: UserPlus, label: 'Other' },
];

export function ProfileFormClient({ profile }: { profile: any }) {
  const [isSaving, setIsSaving] = useState(false);
  
  // State for dynamic fields
  const [role, setRole] = useState(profile?.role || '');
  const [dynamicData, setDynamicData] = useState<Record<string, string>>(profile?.dynamic_data || {});

  const handleDynamicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDynamicData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const renderDynamicFields = () => {
    if (!role) return null;

    switch(role) {
      case 'Student':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="education">Education Level *</Label>
              <Input id="education" name="education" placeholder="e.g. Undergraduate" required defaultValue={profile?.education || ''} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course Name *</Label>
              <Input id="course" name="course" placeholder="e.g. B.Tech Computer Science" required defaultValue={profile?.course || ''} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Current Year of Study *</Label>
              <Input id="year" name="year" placeholder="e.g. 2nd Year" required defaultValue={profile?.year || ''} className="bg-white/5 border-white/10" />
            </div>
          </>
        );
      case 'Farmer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="land_ownership">Land Ownership Status *</Label>
              <Input id="land_ownership" name="land_ownership" placeholder="e.g. Owner, Tenant" value={dynamicData.land_ownership || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="land_size">Land Size (in acres) *</Label>
              <Input id="land_size" name="land_size" type="number" step="0.1" placeholder="e.g. 2.5" value={dynamicData.land_size || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop_type">Primary Crop Type *</Label>
              <Input id="crop_type" name="crop_type" placeholder="e.g. Wheat, Rice, Cotton" value={dynamicData.crop_type || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="irrigation_type">Irrigation Type</Label>
              <Input id="irrigation_type" name="irrigation_type" placeholder="e.g. Drip, Rainfed, Canal" value={dynamicData.irrigation_type || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" />
            </div>
          </>
        );
      case 'Job Seeker':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="highest_education">Highest Education *</Label>
              <Input id="highest_education" name="highest_education" placeholder="e.g. B.A., ITI Diploma" value={dynamicData.highest_education || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Key Skills *</Label>
              <Input id="skills" name="skills" placeholder="e.g. Data Entry, Driving, Coding" value={dynamicData.skills || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employment_status">Current Status *</Label>
              <Input id="employment_status" name="employment_status" placeholder="e.g. Unemployed, Part-time" value={dynamicData.employment_status || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" required />
            </div>
          </>
        );
      case 'Entrepreneur':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="business_stage">Business Stage *</Label>
              <Input id="business_stage" name="business_stage" placeholder="e.g. Idea, Startup, Growth" value={dynamicData.business_stage || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_type">Business Type *</Label>
              <Input id="business_type" name="business_type" placeholder="e.g. Retail, Manufacturing, Tech" value={dynamicData.business_type || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="msme_registered">Is MSME Registered? (Yes/No)</Label>
              <Input id="msme_registered" name="msme_registered" placeholder="e.g. Yes" value={dynamicData.msme_registered || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="annual_turnover">Annual Turnover (₹)</Label>
              <Input id="annual_turnover" name="annual_turnover" type="number" placeholder="e.g. 500000" value={dynamicData.annual_turnover || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" />
            </div>
          </>
        );
      case 'Senior Citizen':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="pension_status">Receiving Pension? (Yes/No) *</Label>
              <Input id="pension_status" name="pension_status" placeholder="e.g. Yes, No" value={dynamicData.pension_status || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="living_arrangement">Living Arrangement</Label>
              <Input id="living_arrangement" name="living_arrangement" placeholder="e.g. Alone, With Family, Care Home" value={dynamicData.living_arrangement || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" />
            </div>
          </>
        );
      default:
        // Generic fallback fields
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="occupation">Current Occupation</Label>
              <Input id="occupation" name="occupation" placeholder="e.g. Tailor, Freelancer" value={dynamicData.occupation || ''} onChange={handleDynamicChange} className="bg-white/5 border-white/10" />
            </div>
          </>
        );
    }
  };

  return (
    <form action={async (formData) => {
      setIsSaving(true);
      // Append role and dynamic data directly to formData
      formData.append('role', role);
      formData.append('dynamic_data', JSON.stringify(dynamicData));
      
      try {
        await saveProfile(formData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }}>
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">1. Who are you?</CardTitle>
          <CardDescription>Select your primary role so we can ask the right questions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                    isActive 
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]" 
                      : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className={cn("w-6 h-6 mb-2", isActive ? "text-indigo-400" : "")} />
                  <span className="text-sm font-medium text-center">{r.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {role && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl">2. Essential Information</CardTitle>
                <CardDescription>Required fields to help the AI match you accurately.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Base Profile Fields */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center text-indigo-100">
                    <span className="bg-indigo-500/20 text-indigo-400 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">A</span>
                    Common Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-black/20 border border-white/5">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input id="age" name="age" type="number" placeholder="e.g. 25" required defaultValue={profile?.age || ''} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" name="state" placeholder="e.g. Maharashtra" required defaultValue={profile?.state || ''} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <Input id="district" name="district" placeholder="e.g. Pune" required defaultValue={profile?.district || ''} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annual_income">Annual Family Income (₹) *</Label>
                      <Input id="annual_income" name="annual_income" type="number" placeholder="e.g. 250000" required defaultValue={profile?.annual_income || ''} className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                </div>

                {/* Dynamic Fields */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center text-emerald-100">
                    <span className="bg-emerald-500/20 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">B</span>
                    {role} Details
                  </h3>
                  <div key={role} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-black/20 border border-white/5">
                    {renderDynamicFields()}
                  </div>
                </div>

                {/* Optional Demographics */}
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-lg font-medium mb-1">Optional Demographics</h3>
                  <p className="text-sm text-muted-foreground mb-6">Skip these if you prefer, but they unlock specialized schemes.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category (Optional)</Label>
                      <Input id="category" name="category" placeholder="e.g. General, OBC, SC, ST" defaultValue={profile?.category || ''} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender (Optional)</Label>
                      <Input id="gender" name="gender" placeholder="e.g. Male, Female, Other" defaultValue={profile?.gender || ''} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="disability">Disability (Optional)</Label>
                      <Input id="disability" name="disability" placeholder="e.g. None, Visually Impaired" defaultValue={profile?.disability || ''} className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex justify-end pt-6 border-t border-white/10 bg-white/5 rounded-b-xl">
                <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto h-12 px-8">
                  {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                  {profile ? 'Update Dynamic Profile' : 'Save Dynamic Profile'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
