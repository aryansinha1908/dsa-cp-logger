"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

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
    solvedBy: "by me",
    tags: [] as string[],
    keyInsights: "",
    mistakes: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") router.push("/")
  }, [status, router])

  const fetchMetadata = async () => {
    if (!url) return
    setLoadingMeta(true)
    setError("")
    try {
      const res = await fetch("/api/fetch-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch metadata")
      setFormData(prev => ({
        ...prev,
        title: data.title ?? prev.title,
        platform: data.platform ?? prev.platform,
        difficulty: data.difficulty ?? prev.difficulty,
        tags: data.tags ?? prev.tags,
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
        body: JSON.stringify({ url, ...formData }),
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

  if (status === "loading") return null

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <Link href="/problems" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to problems
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Log a problem</h1>
        <p className="text-base text-muted-foreground">Paste a LeetCode or Codeforces URL to auto-fill the details.</p>
      </div>

      <div className="border border-border rounded-2xl overflow-hidden" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">

            {/* URL + Fetch */}
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">Problem URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="https://leetcode.com/problems/two-sum/"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  required
                  className="text-base rounded-xl h-11"
                />
                <Button type="button" variant="outline" onClick={fetchMetadata} disabled={loadingMeta || !url} className="shrink-0 rounded-xl h-11 px-5 text-base">
                  {loadingMeta ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
                </Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            {/* Title + Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="text-base rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Platform</Label>
                <Select value={formData.platform} onValueChange={v => setFormData({ ...formData, platform: v ?? "" })}>
                  <SelectTrigger className="text-base rounded-xl h-11"><SelectValue placeholder="Select platform" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LeetCode">LeetCode</SelectItem>
                    <SelectItem value="Codeforces">Codeforces</SelectItem>
                    <SelectItem value="HackerRank">HackerRank</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Difficulty + Solved By */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Difficulty</Label>
                <Input value={formData.difficulty} readOnly className="text-base rounded-xl h-11 bg-muted cursor-not-allowed text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Solved by</Label>
                <Select value={formData.solvedBy} onValueChange={v => setFormData({ ...formData, solvedBy: v ?? "by me" })}>
                  <SelectTrigger className="text-base rounded-xl h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="by me">By me</SelectItem>
                    <SelectItem value="editorial">Editorial</SelectItem>
                    <SelectItem value="AI assisted">AI assisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">Tags <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
              <Input
                id="tags"
                placeholder="binary search, dynamic programming…"
                value={formData.tags.join(", ")}
                onChange={e => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                className="text-base rounded-xl h-11"
              />
            </div>

            {/* Key Insights */}
            <div className="space-y-2">
              <Label htmlFor="insights" className="text-sm font-medium">Key insights</Label>
              <textarea
                id="insights"
                rows={3}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2.5 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                placeholder="What was the key insight to solve this?"
                value={formData.keyInsights}
                onChange={e => setFormData({ ...formData, keyInsights: e.target.value })}
              />
            </div>

            {/* Mistakes */}
            <div className="space-y-2">
              <Label htmlFor="mistakes" className="text-sm font-medium">Mistakes & pitfalls</Label>
              <textarea
                id="mistakes"
                rows={3}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2.5 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                placeholder="What edge cases or mistakes should you remember?"
                value={formData.mistakes}
                onChange={e => setFormData({ ...formData, mistakes: e.target.value })}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-card flex justify-end gap-2">
            <Button type="button" variant="ghost" asChild className="rounded-xl text-base">
              <Link href="/problems">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting} className="rounded-xl text-base px-6">
              {submitting ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Saving…</> : "Log problem"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
