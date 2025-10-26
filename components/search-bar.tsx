"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "ap", label: "AP Courses" },
  { value: "sat-act", label: "SAT/ACT" },
  { value: "college", label: "College Courses" },
  { value: "certification", label: "Certifications" },
  { value: "other", label: "Other" },
]

const SUBJECTS = [
  { value: "all", label: "All Subjects" },
  { value: "math", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "english", label: "English" },
  { value: "history", label: "History" },
  { value: "cs", label: "Computer Science" },
  { value: "languages", label: "Languages" },
  { value: "other", label: "Other" },
]

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [subject, setSubject] = useState(searchParams.get("subject") || "all")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category !== "all") params.set("category", category)
    if (subject !== "all") params.set("subject", subject)

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search notes, subjects, or topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      <div className="flex gap-2">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
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
  )
}
