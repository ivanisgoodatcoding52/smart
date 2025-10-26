"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Note = {
  id: string
  title: string
  description: string
  author_name: string
  category: string
  subject: string
  tags: string[]
  file_url: string | null
  file_name: string | null
  file_type: string | null
  views: number
  downloads: number
  created_at: string
}

export function NotesGrid({ initialNotes }: { initialNotes: Note[] }) {
  const searchParams = useSearchParams()
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true)
      const params = new URLSearchParams(searchParams.toString())
      const response = await fetch(`/api/notes?${params}`)
      const data = await response.json()
      setNotes(data.notes || [])
      setLoading(false)
    }

    if (searchParams.toString()) {
      fetchNotes()
    } else {
      setNotes(initialNotes)
    }
  }, [searchParams, initialNotes])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-32 bg-muted" />
            <CardContent className="h-24 bg-muted/50" />
          </Card>
        ))}
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No notes found</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
        <Link href="/upload">
          <Button>Upload the first note</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <Card key={note.id} className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-2 mb-2">
              <Badge variant="secondary">{note.category}</Badge>
              <Badge variant="outline">{note.subject}</Badge>
            </div>
            <h3 className="font-semibold text-lg line-clamp-2">{note.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{note.description}</p>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              By <span className="font-medium">{note.author_name}</span>
            </p>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t pt-4">
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
            <Link href={`/notes/${note.id}`}>
              <Button size="sm">View</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
