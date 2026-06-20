"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Trash2, ExternalLink, Plus, ChevronDown, Check, X } from "lucide-react"

const DIFFICULTY_STYLE: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-400/10",
  Medium: "text-yellow-400 bg-yellow-400/10",
  Hard: "text-red-400 bg-red-400/10",
}

function TagFilter({ allTags, selectedTags, onChange }: {
  allTags: string[]
  selectedTags: string[]
  onChange: (tags: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = allTags.filter(t => t.toLowerCase().includes(search.toLowerCase()))

  const toggle = (tag: string) => {
    onChange(selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag])
  }

  const label = selectedTags.length === 0
    ? "All tags"
    : selectedTags.length === 1
    ? selectedTags[0]
    : `${selectedTags.length} tags`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex h-9 w-44 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
      >
        <span className="truncate text-left flex-1 text-sm">
          {selectedTags.length === 0
            ? <span className="text-muted-foreground">All tags</span>
            : label}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-1" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-56 rounded-md border border-border bg-popover shadow-lg overflow-hidden">
          <div className="p-2 border-b border-border">
            <Input
              placeholder="Search tags…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-7 text-xs"
              autoFocus
            />
          </div>
          <div className="max-h-52 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2 py-3 text-center">No tags found</p>
            ) : (
              filtered.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggle(tag)}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted transition-colors text-left"
                >
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${selectedTags.includes(tag) ? "bg-primary border-primary" : "border-input"}`}>
                    {selectedTags.includes(tag) && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                  </div>
                  {tag}
                </button>
              ))
            )}
          </div>
          {selectedTags.length > 0 && (
            <div className="p-2 border-t border-border">
              <button
                type="button"
                onClick={() => onChange([])}
                className="flex w-full items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" /> Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ProblemsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [problems, setProblems] = useState<any[]>([])
  const [allProblems, setAllProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState("")
  const [platform, setPlatform] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [solvedBy, setSolvedBy] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // All unique tags from the user's problems
  const allTags = [...new Set(allProblems.flatMap(p => p.tags ?? []))].sort()

  useEffect(() => {
    if (status === "unauthenticated") router.push("/")
  }, [status, router])

  // Fetch all problems once to build tag list
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/problems").then(r => r.json()).then(d => {
        if (Array.isArray(d)) setAllProblems(d)
      })
    }
  }, [status])

  useEffect(() => {
    if (status === "authenticated") fetchProblems()
  }, [status, query, platform, difficulty, solvedBy, selectedTags])

  const fetchProblems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append("query", query)
      if (platform) params.append("platform", platform)
      if (difficulty) params.append("difficulty", difficulty)
      if (solvedBy) params.append("solvedBy", solvedBy)
      // Send each selected tag; API filters by `has` so we apply client-side for multi
      const res = await fetch(`/api/problems?${params}`)
      const data = await res.json()
      const filtered = Array.isArray(data) ? data : []
      // Client-side multi-tag filter (API only supports single tag)
      setProblems(
        selectedTags.length === 0
          ? filtered
          : filtered.filter((p: any) => selectedTags.every(t => p.tags?.includes(t)))
      )
    } catch {
      setProblems([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this problem?")) return
    const res = await fetch(`/api/problems/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProblems(p => p.filter(x => x.id !== id))
      setAllProblems(p => p.filter(x => x.id !== id))
    }
  }

  if (status === "loading") return null

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Problems</h1>
          <p className="text-sm text-muted-foreground mt-1">{problems.length} problem{problems.length !== 1 ? "s" : ""} logged</p>
        </div>
        <Button asChild>
          <Link href="/problems/new"><Plus className="w-4 h-4 mr-2" />Log Problem</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 pb-4 border-b border-border">
        <Input
          placeholder="Search title…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-48"
        />
        <TagFilter allTags={allTags} selectedTags={selectedTags} onChange={setSelectedTags} />
        <Select value={platform} onValueChange={v => setPlatform(v === "_all" ? "" : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All platforms</SelectItem>
            <SelectItem value="LeetCode">LeetCode</SelectItem>
            <SelectItem value="Codeforces">Codeforces</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={v => setDifficulty(v === "_all" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={solvedBy} onValueChange={v => setSolvedBy(v === "_all" ? "" : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All</SelectItem>
            <SelectItem value="by me">By me</SelectItem>
            <SelectItem value="editorial">Editorial</SelectItem>
            <SelectItem value="AI assisted">AI assisted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading…</div>
      ) : problems.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-border rounded-lg space-y-4">
          <p className="text-base font-medium">No problems found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or log a new problem.</p>
          <Button variant="outline" asChild>
            <Link href="/problems/new">Log your first problem</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground w-full">Problem</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap hidden sm:table-cell">Platform</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap hidden md:table-cell">Difficulty</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap hidden lg:table-cell">Tags</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap hidden lg:table-cell">Solved by</th>
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap hidden sm:table-cell">Date</th>
                <th className="px-3 py-3 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {problems.map((p: any) => (
                <tr key={p.id} className="bg-background hover:bg-card transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-1.5">
                      <a href={p.url} target="_blank" rel="noreferrer" className="font-medium text-foreground hover:text-primary transition-colors leading-snug">
                        {p.title}
                      </a>
                      <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-2 mt-1 sm:hidden">
                      <span className="text-xs text-muted-foreground">{p.platform}</span>
                      {p.difficulty && (
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${DIFFICULTY_STYLE[p.difficulty] ?? "text-muted-foreground bg-muted"}`}>
                          {p.difficulty}
                        </span>
                      )}
                    </div>
                    {p.keyInsights && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1 hidden md:block">{p.keyInsights}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell whitespace-nowrap">{p.platform}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {p.difficulty && (
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${DIFFICULTY_STYLE[p.difficulty] ?? "text-muted-foreground bg-muted"}`}>
                        {p.difficulty}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {p.tags?.slice(0, 3).map((t: string) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{t}</span>
                      ))}
                      {p.tags?.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{p.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap capitalize">{p.solvedBy}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <Link href={`/problems/${p.id}/edit`}><Edit className="w-3.5 h-3.5" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
