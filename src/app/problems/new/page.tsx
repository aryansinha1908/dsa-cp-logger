"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewProblemPage() {
  const { status } = useSession()
  const router = useRouter()
  
  const [url, setUrl] = useState("")
  const [loadingMeta, setLoadingMeta] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    title: "",
    platform: "",
    difficulty: "Medium",
    tags: [] as string[],
    keyInsights: "",
    mistakes: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  const fetchMetadata = async () => {
    if (!url) return
    setLoadingMeta(true)
    setError("")
    try {
      const res = await fetch("/api/fetch-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch metadata")
      
      setFormData(prev => ({
        ...prev,
        title: data.title || "",
        platform: data.platform || "",
        difficulty: data.difficulty || "Medium",
        tags: data.tags || []
      }))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoadingMeta(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          ...formData
        })
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to log problem")
      }
      
      router.push("/problems")
    } catch (e: any) {
      setError(e.message)
      setSubmitting(false)
    }
  }

  if (status === "loading") return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="border shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Log a New Problem</CardTitle>
          <CardDescription>
            Paste the problem URL to automatically fetch its details, then add your insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Problem URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="url"
                  placeholder="https://leetcode.com/problems/two-sum/" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <Button type="button" onClick={fetchMetadata} disabled={loadingMeta || !url}>
                  {loadingMeta ? "Fetching..." : "Fetch"}
                </Button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select 
                  value={formData.platform} 
                  onValueChange={(val) => setFormData({...formData, platform: val || ""})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LeetCode">LeetCode</SelectItem>
                    <SelectItem value="Codeforces">Codeforces</SelectItem>
                    <SelectItem value="HackerRank">HackerRank</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(val) => setFormData({...formData, difficulty: val || ""})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                  <SelectItem value="Unrated">Unrated</SelectItem>
                  {/* For CF ratings */}
                  <SelectItem value="800">800</SelectItem>
                  <SelectItem value="1000">1000</SelectItem>
                  <SelectItem value="1200">1200</SelectItem>
                  <SelectItem value="1400">1400</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insights">Key Insights</Label>
              <textarea 
                id="insights"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="What was the trick to solving this?"
                value={formData.keyInsights}
                onChange={(e) => setFormData({...formData, keyInsights: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mistakes">Mistakes & Pitfalls</Label>
              <textarea 
                id="mistakes"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="What edge cases did you miss?"
                value={formData.mistakes}
                onChange={(e) => setFormData({...formData, mistakes: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Saving..." : "Log Problem"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
