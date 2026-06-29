import { Card, CardContent } from '@/components/ui/card';
import { Target, Shield, Zap, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <Target className="w-8 h-8 text-indigo-400" />,
      title: "Precision Matchmaking",
      description: "Using advanced AI embeddings and Pinecone vector search, we map your unique profile directly to the schemes you are eligible for."
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      title: "Secure & Private",
      description: "Your data is secured with Supabase Authentication. We process your documents and details with the highest privacy standards."
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      title: "Real-Time AI Processing",
      description: "Our FastAPI backend leverages state-of-the-art LLMs to instantly answer questions and extract data from your uploaded documents."
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-rose-400" />,
      title: "Citizen First",
      description: "Designed for accessibility. We support voice inputs and multilingual capabilities to ensure every citizen can find the help they need."
    }
  ];

  return (
    <main className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-background to-background pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            About SchemePilot AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between citizens and government welfare. We believe that discovering and applying for government schemes should be as simple as having a conversation.
          </p>
        </div>

        {/* The Problem / Solution Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4 text-rose-400">The Problem</h3>
              <p className="text-muted-foreground leading-relaxed">
                Millions of eligible citizens miss out on crucial government benefits every year. The primary barriers? Complex eligibility criteria, bureaucratic jargon, scattered information across hundreds of portals, and difficult application processes. Finding the right scheme feels like searching for a needle in a haystack.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4 text-emerald-400">Our Solution</h3>
              <p className="text-muted-foreground leading-relaxed">
                SchemePilot AI acts as a digital companion. By conversing with our AI, citizens can instantly discover schemes tailored specifically to their demographic, income, and occupation. Our platform automatically cross-references your profile against a live vector database of government schemes to guarantee accurate matchmaking.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powered by Next-Gen Technology</h2>
          <p className="text-muted-foreground">Built with Next.js, FastAPI, LangGraph, and Pinecone.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </main>
  );
}
