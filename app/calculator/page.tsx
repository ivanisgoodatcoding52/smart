"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calculator, TrendingUp, Award, BookOpen } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CalculatorResults } from "@/components/calculator-results"

export default function CalculatorPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [formData, setFormData] = useState({
    gpa: 3.5,
    satScore: 1200,
    actScore: 24,
    testType: "sat",
    apClasses: 3,
    extracurriculars: "moderate",
    awards: "some",
    intendedMajor: "undecided",
    collegeName: "",
  })

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/calculate-chances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("[v0] Calculation error:", error)
      alert("Failed to calculate chances. Please try again.")
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
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">College Chances Calculator</h1>
            <p className="text-muted-foreground">
              Estimate your admission chances based on your academic profile and real college data
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Academic Profile
                  </CardTitle>
                  <CardDescription>Enter your academic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="collegeName">College Name</Label>
                    <Input
                      id="collegeName"
                      placeholder="e.g., Stanford University"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA (Weighted): {formData.gpa.toFixed(2)}</Label>
                    <Slider
                      id="gpa"
                      min={0}
                      max={5}
                      step={0.1}
                      value={[formData.gpa]}
                      onValueChange={([value]) => setFormData({ ...formData, gpa: value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testType">Test Type</Label>
                    <Select
                      value={formData.testType}
                      onValueChange={(value) => setFormData({ ...formData, testType: value })}
                    >
                      <SelectTrigger id="testType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sat">SAT</SelectItem>
                        <SelectItem value="act">ACT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.testType === "sat" ? (
                    <div className="space-y-2">
                      <Label htmlFor="satScore">SAT Score: {formData.satScore}</Label>
                      <Slider
                        id="satScore"
                        min={400}
                        max={1600}
                        step={10}
                        value={[formData.satScore]}
                        onValueChange={([value]) => setFormData({ ...formData, satScore: value })}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="actScore">ACT Score: {formData.actScore}</Label>
                      <Slider
                        id="actScore"
                        min={1}
                        max={36}
                        step={1}
                        value={[formData.actScore]}
                        onValueChange={([value]) => setFormData({ ...formData, actScore: value })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="apClasses">AP/IB Classes: {formData.apClasses}</Label>
                    <Slider
                      id="apClasses"
                      min={0}
                      max={20}
                      step={1}
                      value={[formData.apClasses]}
                      onValueChange={([value]) => setFormData({ ...formData, apClasses: value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Extracurriculars & Awards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="extracurriculars">Extracurricular Involvement</Label>
                    <Select
                      value={formData.extracurriculars}
                      onValueChange={(value) => setFormData({ ...formData, extracurriculars: value })}
                    >
                      <SelectTrigger id="extracurriculars">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal (1-2 activities)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-5 activities)</SelectItem>
                        <SelectItem value="strong">Strong (6+ activities, leadership)</SelectItem>
                        <SelectItem value="exceptional">Exceptional (National/International recognition)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="awards">Awards & Honors</Label>
                    <Select
                      value={formData.awards}
                      onValueChange={(value) => setFormData({ ...formData, awards: value })}
                    >
                      <SelectTrigger id="awards">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="some">Some (School-level)</SelectItem>
                        <SelectItem value="many">Many (Regional/State)</SelectItem>
                        <SelectItem value="exceptional">Exceptional (National/International)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intendedMajor">Intended Major</Label>
                    <Select
                      value={formData.intendedMajor}
                      onValueChange={(value) => setFormData({ ...formData, intendedMajor: value })}
                    >
                      <SelectTrigger id="intendedMajor">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="undecided">Undecided</SelectItem>
                        <SelectItem value="stem">STEM</SelectItem>
                        <SelectItem value="humanities">Humanities</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="arts">Arts</SelectItem>
                        <SelectItem value="social-sciences">Social Sciences</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleCalculate} className="w-full" disabled={loading}>
                    <Calculator className="h-4 w-4 mr-2" />
                    {loading ? "Calculating..." : "Calculate Chances"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div>
              {results ? (
                <CalculatorResults results={results} />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Calculate</h3>
                    <p className="text-muted-foreground">
                      Fill in your information and click Calculate to see your admission chances
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
