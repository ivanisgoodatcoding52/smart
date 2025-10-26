"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, AlertCircle, CheckCircle, Lightbulb } from "lucide-react"

type ResultsProps = {
  results: {
    collegeName: string
    admissionChance: number
    category: string
    comparison: {
      gpa: string
      testScore: string
      overall: string
    }
    strengths: string[]
    improvements: string[]
    aiFeedback: string
  }
}

export function CalculatorResults({ results }: ResultsProps) {
  const getChanceColor = (chance: number) => {
    if (chance >= 70) return "text-green-600 dark:text-green-400"
    if (chance >= 40) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getChanceLabel = (chance: number) => {
    if (chance >= 70) return "Strong Chance"
    if (chance >= 40) return "Moderate Chance"
    return "Reach School"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Admission Chances
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">{results.collegeName}</h3>
            <div className={`text-5xl font-bold mb-2 ${getChanceColor(results.admissionChance)}`}>
              {results.admissionChance}%
            </div>
            <Badge variant="secondary" className="text-sm">
              {getChanceLabel(results.admissionChance)}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Admission Probability</span>
                <span className="font-medium">{results.admissionChance}%</span>
              </div>
              <Progress value={results.admissionChance} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">GPA</span>
              <Badge variant={results.comparison.gpa === "Above Average" ? "default" : "secondary"}>
                {results.comparison.gpa}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Test Score</span>
              <Badge variant={results.comparison.testScore === "Above Average" ? "default" : "secondary"}>
                {results.comparison.testScore}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Overall Profile</span>
              <Badge variant={results.comparison.overall === "Competitive" ? "default" : "secondary"}>
                {results.comparison.overall}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Your Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.improvements.map((improvement, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{results.aiFeedback}</p>
        </CardContent>
      </Card>
    </div>
  )
}
