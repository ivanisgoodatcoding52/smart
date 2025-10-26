import { createClient } from "@/lib/supabase/server"
import { NotesGrid } from "@/components/notes-grid"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload, Calculator, BookOpen, Code, Sparkles } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from("notes").select("*").order("created_at", { ascending: false }).limit(12)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo area - user will add logo */}
              <div className="h-10 w-10 rounded-lg bg-primary" />
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium hover:text-primary">
                  Browse
                </Link>
                <Link href="/upload" className="text-sm font-medium hover:text-primary">
                  Upload
                </Link>
                <Link href="/calculator" className="text-sm font-medium hover:text-primary">
                  Calculator
                </Link>
                <Link href="/assistant" className="text-sm font-medium hover:text-primary">
                  AI Assistant
                </Link>
                <Link href="/api-docs" className="text-sm font-medium hover:text-primary">
                  API
                </Link>
              </nav>
            </div>
            <Link href="/upload">
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Notes
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
              Share Knowledge, Ace Your Studies
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
              Access thousands of study materials, notes, and resources for APs, SAT/ACT, college courses, and
              professional certifications. No sign-up required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button size="lg" className="w-full sm:w-auto">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Your Notes
                </Button>
              </Link>
              <Link href="/calculator">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Calculator className="h-5 w-5 mr-2" />
                  College Calculator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex gap-4 p-6 rounded-lg bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Vast Library</h3>
                <p className="text-sm text-muted-foreground">
                  Access notes for APs, standardized tests, college courses, and certifications
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-lg bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Admission Calculator</h3>
                <p className="text-sm text-muted-foreground">
                  Estimate your college admission chances with real data and AI insights
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-lg bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI Study Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized help with your studies and create custom study plans
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-lg bg-card border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Developer API</h3>
                <p className="text-sm text-muted-foreground">
                  Integrate our resources into your apps with our REST API
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Notes */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Recent Uploads</h2>
          <p className="text-muted-foreground">Browse the latest study materials shared by the community</p>
        </div>
        <SearchBar />
        <NotesGrid initialNotes={notes || []} />
      </section>
    </div>
  )
}
