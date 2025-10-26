"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, LinkIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

const CATEGORIES = [
  { value: "ap", label: "AP Courses" },
  { value: "sat-act", label: "SAT/ACT" },
  { value: "college", label: "College Courses" },
  { value: "certification", label: "Certifications" },
  { value: "other", label: "Other" },
]

const SUBJECTS = [
  { value: "math", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "english", label: "English" },
  { value: "history", label: "History" },
  { value: "cs", label: "Computer Science" },
  { value: "languages", label: "Languages" },
  { value: "other", label: "Other" },
]

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadType, setUploadType] = useState<"file" | "link">("file")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    authorName: "",
    category: "",
    subject: "",
    tags: "",
    externalLink: "",
  })
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("authorName", formData.authorName)
      data.append("category", formData.category)
      data.append("subject", formData.subject)
      data.append("tags", formData.tags)

      if (uploadType === "file" && file) {
        data.append("file", file)
      } else if (uploadType === "link") {
        data.append("externalLink", formData.externalLink)
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      router.push(`/notes/${result.note.id}`)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert("Failed to upload. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Upload Notes</h1>
          <p className="text-muted-foreground">Share your study materials with the community. No account required.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Note Details</CardTitle>
            <CardDescription>Fill in the information about your study material</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., AP Biology Chapter 5 Notes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the content..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorName">Your Name *</Label>
                <Input
                  id="authorName"
                  placeholder="e.g., John Doe"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    required
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((sub) => (
                        <SelectItem key={sub.value} value={sub.value}>
                          {sub.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., biology, cells, photosynthesis"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <Label>Upload Method</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={uploadType === "file" ? "default" : "outline"}
                    onClick={() => setUploadType("file")}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    type="button"
                    variant={uploadType === "link" ? "default" : "outline"}
                    onClick={() => setUploadType("link")}
                    className="flex-1"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    External Link
                  </Button>
                </div>

                {uploadType === "file" ? (
                  <div className="space-y-2">
                    <Label htmlFor="file">File</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg,.mp4"
                    />
                    <p className="text-xs text-muted-foreground">Supported: PDF, DOCX, PPTX, TXT, ZIP, PNG, JPG, MP4</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="externalLink">External Link</Label>
                    <Input
                      id="externalLink"
                      type="url"
                      placeholder="https://..."
                      value={formData.externalLink}
                      onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Uploading..." : "Upload Note"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
