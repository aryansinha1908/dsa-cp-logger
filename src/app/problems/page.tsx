"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Trash2, ExternalLink, Plus, ChevronDown, Check, X, ChevronLeft, ChevronRight } from "lucide-react"

const PAGE_SIZE = 51

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
  const toggle = (tag: string) =>
    onChange(selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag])
  const label = selectedTags.length === 0 ? "All tags" : selectedTags.length === 1 ? selectedTags[0] : `${selectedTags.length} tags`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex h-9 w-44 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
      >
        <span className="truncate text-left flex-1 text-sm">
          {selectedTags.length === 0 ? <span className="text-muted-foreground">All tags</span> : label}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-1" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-56 rounded-md border border-border bg-popover shadow-lg overflow-hidden">
          <div className="p-2 border-b border-border">
            <Input placeholder="Search tags…" value={search} onChange={e => setSearch(e.target.value)} className="h-7 text-xs" autoFocus />
          </div>
          <div className="max-h-52 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2 py-3 text-center">No tags found</p>
            ) : (
              filtered.map(tag => (
                <button key={tag} type="button" onClick={() => toggle(tag)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted transition-colors text-left">
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
              <button type="button" onClick={() => onChange([])} className="flex w-full items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
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
  const [page, setPage] = useState(1)

  const [query, setQuery] = useState("")
  const [platform, setPlatform] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [solvedBy, setSolvedBy] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = [...new Set(allProblems.flatMap(p => p.tags ?? []))].sort()

  useEffect(() => {
    if (status === "unauthenticated") router.push("/")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/problems").then(r => r.json()).then(d => {
        if (Array.isArray(d)) setAllProblems(d)
      })
    }
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      setPage(1)
      fetchProblems()
    }
  }, [status, query, platform, difficulty, solvedBy, selectedTags])

  const fetchProblems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append("query", query)
      if (platform) params.append("platform", platform)
      if (difficulty) params.append("difficulty", difficulty)
      if (solvedBy) params.append("solvedBy", solvedBy)
      const res = await fetch(`/api/problems?${params}`)
      const data = await res.json()
      const filtered = Array.isArray(data) ? data : []
      setProblems(
        selectedTags.length === 0 ? filtered : filtered.filter((p: any) => selectedTags.every(t => p.tags?.includes(t)))
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

  const totalPages = Math.ceil(problems.length / PAGE_SIZE)
  const paginated = problems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-8" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>

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
        <Input placeholder="Search title…" value={query} onChange={e => setQuery(e.target.value)} className="w-48" />
        <TagFilter allTags={allTags} selectedTags={selectedTags} onChange={setSelectedTags} />
        <Select value={platform} onValueChange={v => setPlatform(!v || v === "_all" ? "" : v)}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All platforms" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All platforms</SelectItem>
            <SelectItem value="LeetCode">LeetCode</SelectItem>
            <SelectItem value="Codeforces">Codeforces</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={v => setDifficulty(!v || v === "_all" ? "" : v)}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All difficulties" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={solvedBy} onValueChange={v => setSolvedBy(!v || v === "_all" ? "" : v)}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All</SelectItem>
            <SelectItem value="by me">By me</SelectItem>
            <SelectItem value="editorial">Editorial</SelectItem>
            <SelectItem value="AI assisted">AI assisted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards */}
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((p: any) => (
              <div key={p.id} className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
                {/* Title row */}
                <div className="flex items-start justify-between gap-2">
                  <a href={p.url} target="_blank" rel="noreferrer" className="font-medium text-foreground hover:text-primary transition-colors leading-snug line-clamp-2 flex-1">
                    {p.title}
                  </a>
                  <a href={p.url} target="_blank" rel="noreferrer" className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                  <span>{p.platform}</span>
                  {p.difficulty && (
                    <span className={`px-1.5 py-0.5 rounded font-medium ${DIFFICULTY_STYLE[p.difficulty] ?? "text-muted-foreground bg-muted"}`}>
                      {p.difficulty}
                    </span>
                  )}
                  <span className="ml-auto">{new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>

                {/* Tags */}
                {p.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map((t: string) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{t}</span>
                    ))}
                    {p.tags.length > 3 && <span className="text-xs text-muted-foreground">+{p.tags.length - 3}</span>}
                  </div>
                )}

                {/* Key insight */}
                {p.keyInsights && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.keyInsights}</p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity mt-auto pt-1 border-t border-border">
                  <span className="text-xs text-muted-foreground capitalize flex-1">{p.solvedBy}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                    <Link href={`/problems/${p.id}/edit`}><Edit className="w-3.5 h-3.5" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <Button
                  key={n}
                  variant={n === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              ))}
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
