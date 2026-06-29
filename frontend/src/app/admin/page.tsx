'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Database, Activity, UploadCloud, Search, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for the table
  const schemes = [
    { id: 1, name: 'PM-KISAN', category: 'Agriculture', status: 'Active', updated: '2023-10-12' },
    { id: 2, name: 'Post Matric Scholarship', category: 'Education', status: 'Active', updated: '2023-09-01' },
    { id: 3, name: 'Mudra Yojana', category: 'Entrepreneurship', status: 'Inactive', updated: '2023-08-15' },
    { id: 4, name: 'Beti Bachao Beti Padhao', category: 'Women Empowerment', status: 'Active', updated: '2023-10-05' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-md hidden md:block">
        <div className="p-6">
          <h2 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-400" /> Admin Portal
          </h2>
          <nav className="space-y-2">
            <Button variant="secondary" className="w-full justify-start bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30">
              <Activity className="mr-2 h-4 w-4" /> Overview
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <FileText className="mr-2 h-4 w-4" /> Schemes Database
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <Users className="mr-2 h-4 w-4" /> User Management
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
              <p className="text-muted-foreground">Monitor platform activity and manage the knowledge base.</p>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Active Schemes</CardTitle>
                <Database className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">142</div>
                <p className="text-xs text-emerald-400 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <Users className="h-4 w-4 text-indigo-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8,234</div>
                <p className="text-xs text-indigo-400 mt-1">+1,024 new this week</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">AI Queries Today</CardTitle>
                <Activity className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">45,912</div>
                <p className="text-xs text-muted-foreground mt-1">Avg latency: 1.2s</p>
              </CardContent>
            </Card>
          </div>

          {/* Schemes Data Table */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Scheme Database</CardTitle>
                <CardDescription>Manage the vector embeddings for all government schemes.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search schemes..." className="pl-8 bg-white/5 border-white/10" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-white/10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-4 text-left font-medium text-muted-foreground whitespace-nowrap">Scheme Name</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Category</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
                      <th className="p-4 text-left font-medium text-muted-foreground whitespace-nowrap">Last Updated</th>
                      <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemes.map((scheme) => (
                      <tr key={scheme.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium whitespace-nowrap">{scheme.name}</td>
                        <td className="p-4">{scheme.category}</td>
                        <td className="p-4">
                          <Badge variant={scheme.status === 'Active' ? 'default' : 'secondary'} className={scheme.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/30'}>
                            {scheme.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground whitespace-nowrap">{scheme.updated}</td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
