"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProblemsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [query, setQuery] = useState("")
  const [platform, setPlatform] = useState("all")
  const [difficulty, setDifficulty] = useState("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchProblems()
    }
  }, [status, query, platform, difficulty])

  const fetchProblems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append("query", query)
      if (platform && platform !== "all") params.append("platform", platform)
      if (difficulty && difficulty !== "all") params.append("difficulty", difficulty)
      
      const res = await fetch(`/api/problems?${params.toString()}`)
      const data = await res.json()
      setProblems(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">My Problems</h1>
        <Link href="/problems/new">
          <Button>Log New Problem</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <Input 
          placeholder="Search by title or tags..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={platform} onValueChange={(val) => setPlatform(val || "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="LeetCode">LeetCode</SelectItem>
            <SelectItem value="Codeforces">Codeforces</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={(val) => setDifficulty(val || "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center p-8">Loading problems...</div>
      ) : problems.length === 0 ? (
        <div className="text-center p-12 bg-card rounded-xl border border-dashed">
          <h3 className="text-lg font-semibold mb-2">No problems found</h3>
          <p className="text-muted-foreground mb-4">You haven't logged any problems matching your filters.</p>
          <Link href="/problems/new">
            <Button variant="outline">Log your first problem</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem: any) => (
            <Card key={problem.id} className="overflow-hidden hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    <a href={problem.url} target="_blank" rel="noreferrer" className="hover:underline text-primary">
                      {problem.title}
                    </a>
                  </CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    problem.difficulty === "Easy" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    problem.difficulty === "Hard" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>{problem.platform}</span>
                  <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {problem.tags && problem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {problem.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-md">
                        {tag}
                      </span>
                    ))}
                    {problem.tags.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-secondary rounded-md">+{problem.tags.length - 3}</span>
                    )}
                  </div>
                )}
                
                {problem.keyInsights && (
                  <div>
                    <h4 className="text-sm font-semibold">Key Insights</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{problem.keyInsights}</p>
                  </div>
                )}
                
                {problem.mistakes && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-400">Mistakes</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{problem.mistakes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
