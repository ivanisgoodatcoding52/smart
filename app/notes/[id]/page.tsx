import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: note, error } = await supabase.from("notes").select("*").eq("id", id).single()

  if (error || !note) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("notes")
    .update({ views: (note.views || 0) + 1 })
    .eq("id", id)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex gap-2">
                <Badge variant="secondary">{note.category}</Badge>
                <Badge variant="outline">{note.subject}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {note.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {note.downloads || 0}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
            <p className="text-muted-foreground">
              By <span className="font-medium">{note.author_name}</span> •{" "}
              {new Date(note.created_at).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {note.description && (
              <div>
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{note.description}</p>
              </div>
            )}

            {note.tags && note.tags.length > 0 && (
              <div>
                <h2 className="font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {note.file_url && (
              <div>
                <h2 className="font-semibold mb-2">File</h2>
                <div className="flex items-center gap-4">
                  {note.file_name && <p className="text-sm text-muted-foreground">{note.file_name}</p>}
                  <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                    <Button>
                      {note.file_url.startsWith("http") ? (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Link
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
