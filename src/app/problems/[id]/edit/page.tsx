"use client"

import { useState, useEffect, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { status } = useSession()
  const router = useRouter()
  
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    title: "",
    platform: "",
    difficulty: "Medium",
    solvedBy: "by me",
    tags: [] as string[],
    keyInsights: "",
    mistakes: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated" && id) {
      fetchProblemDetails()
    }
  }, [status, id])

  const fetchProblemDetails = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/problems/${id}`)
      if (!res.ok) {
        throw new Error("Failed to fetch problem details")
      }
      const data = await res.json()
      
      setUrl(data.url || "")
      setFormData({
        title: data.title || "",
        platform: data.platform || "",
        difficulty: data.difficulty || "Medium",
        solvedBy: data.solvedBy || "by me",
        tags: data.tags || [],
        keyInsights: data.keyInsights || "",
        mistakes: data.mistakes || ""
      })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    
    try {
      const res = await fetch(`/api/problems/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          ...formData
        })
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update problem")
      }
      
      router.push("/problems")
    } catch (e: any) {
      setError(e.message)
      setSubmitting(false)
    }
  }

  if (status === "loading" || loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="border shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Problem</CardTitle>
          <CardDescription>
            Update your insights, mistakes, or other problem details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Problem URL</Label>
              <Input 
                id="url"
                placeholder="https://leetcode.com/problems/two-sum/" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(val) => setFormData({...formData, difficulty: val || "Medium"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="solvedBy">Solved By</Label>
                <Select 
                  value={formData.solvedBy} 
                  onValueChange={(val) => setFormData({...formData, solvedBy: val || "by me"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select who solved this" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="by me">By Me</SelectItem>
                    <SelectItem value="editorial">Editorial</SelectItem>
                    <SelectItem value="AI assisted">AI Assisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input 
                id="tags"
                placeholder="binary search, dynamic programming..."
                value={formData.tags.join(", ")}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)})}
              />
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

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4 border-t border-white/5">
              <Button type="button" variant="outline" onClick={() => router.push("/problems")} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
