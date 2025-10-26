"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Key, Code, BookOpen, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ApiDocsPage() {
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedKey, setGeneratedKey] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "" })

  const handleGenerateKey = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/generate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (response.ok) {
        setGeneratedKey(data.apiKey)
      } else {
        alert(data.error || "Failed to generate API key")
      }
    } catch (error) {
      console.error("[v0] Key generation error:", error)
      alert("Failed to generate API key")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={() => copyToClipboard(code, id)}>
        {copied === id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">API Documentation</h1>
          <p className="text-muted-foreground">Access our platform programmatically with our REST API</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Get API Key
                </CardTitle>
                <CardDescription>Generate your developer API key</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!generatedKey ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleGenerateKey} className="w-full" disabled={loading}>
                      {loading ? "Generating..." : "Generate API Key"}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">API Key Generated!</p>
                      <p className="text-xs text-green-700 dark:text-green-300 mb-3">
                        Save this key securely. You won't be able to see it again.
                      </p>
                      <div className="relative">
                        <code className="block p-2 bg-white dark:bg-black rounded text-xs break-all">
                          {generatedKey}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-1 right-1"
                          onClick={() => copyToClipboard(generatedKey, "generated-key")}
                        >
                          {copied === "generated-key" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Base URL</h3>
                  <code className="block p-3 bg-muted rounded text-sm">https://your-domain.com/api/v1</code>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    All API requests require an API key in the Authorization header:
                  </p>
                  <CodeBlock id="auth-example" code={`Authorization: Bearer YOUR_API_KEY`} />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Rate Limits</h3>
                  <p className="text-sm text-muted-foreground">Free tier: 1,000 requests per day</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  API Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="notes">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="calculator">Calculator</TabsTrigger>
                  </TabsList>

                  <TabsContent value="notes" className="space-y-6 mt-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge>GET</Badge>
                        <code className="text-sm">/api/v1/notes</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get a list of all notes with optional filtering
                      </p>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Query Parameters</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>
                              <code className="text-xs bg-muted px-1 py-0.5 rounded">category</code> - Filter by
                              category (ap, sat-act, college, certification, other)
                            </li>
                            <li>
                              <code className="text-xs bg-muted px-1 py-0.5 rounded">subject</code> - Filter by subject
                              (math, science, english, etc.)
                            </li>
                            <li>
                              <code className="text-xs bg-muted px-1 py-0.5 rounded">limit</code> - Number of results
                              (default: 50)
                            </li>
                            <li>
                              <code className="text-xs bg-muted px-1 py-0.5 rounded">offset</code> - Pagination offset
                              (default: 0)
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Example Request</h4>
                          <CodeBlock
                            id="notes-list"
                            code={`curl -X GET "https://your-domain.com/api/v1/notes?category=ap&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge>GET</Badge>
                        <code className="text-sm">/api/v1/notes/:id</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Get a specific note by ID</p>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Example Request</h4>
                        <CodeBlock
                          id="notes-get"
                          code={`curl -X GET "https://your-domain.com/api/v1/notes/123" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="calculator" className="space-y-6 mt-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">POST</Badge>
                        <code className="text-sm">/api/v1/college-chances</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Calculate college admission chances</p>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Request Body</h4>
                          <CodeBlock
                            id="calc-body"
                            code={`{
  "gpa": 3.8,
  "sat": 1400,
  "school": "Stanford University"
}`}
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Example Request</h4>
                          <CodeBlock
                            id="calc-request"
                            code={`curl -X POST "https://your-domain.com/api/v1/college-chances" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"gpa": 3.8, "sat": 1400, "school": "Stanford University"}'`}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
