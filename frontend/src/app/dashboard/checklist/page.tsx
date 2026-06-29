import { createClient } from '@/utils/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare, Trash2, Plus, Check } from 'lucide-react';
import { toggleChecklistItem, removeChecklistItem, addChecklistItem } from '@/app/actions/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default async function ChecklistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: items } = await supabase
    .from('checklist_items')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background pt-10 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background -z-10" />

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">My Checklist</h1>
            <p className="text-muted-foreground text-lg">
              Track your scheme application requirements and documents.
            </p>
          </div>
          <CheckSquare className="w-12 h-12 text-indigo-500/20 hidden md:block" />
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl mb-6">
          <CardContent className="p-4">
            <form action={addChecklistItem} className="flex gap-2">
              <Input name="task" placeholder="Add a new requirement (e.g. Get Income Certificate)" className="bg-white/5 border-white/10" required />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </form>
          </CardContent>
        </Card>

        {(!items || items.length === 0) ? (
          <div className="text-center py-10 text-muted-foreground">
            No items in your checklist. Add one above!
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${item.is_completed ? 'bg-white/5 border-white/5 opacity-50' : 'bg-white/10 border-white/10'}`}>
                <div className="flex items-center gap-4 flex-1">
                  <form action={toggleChecklistItem.bind(null, item.id, item.is_completed)}>
                    <Button variant="ghost" size="icon" className={`rounded-full border w-6 h-6 p-0 flex items-center justify-center ${item.is_completed ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : 'border-white/30 text-transparent hover:border-white/60'}`}>
                      {item.is_completed && <Check className="w-3 h-3" />}
                    </Button>
                  </form>
                  <span className={`text-sm md:text-base ${item.is_completed ? 'line-through text-muted-foreground' : 'text-white'}`}>{item.task}</span>
                </div>
                <form action={removeChecklistItem.bind(null, item.id)}>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-400 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
