"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { Edit, Trash2 } from "lucide-react"

export default function ProblemsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [query, setQuery] = useState("")
  const [platform, setPlatform] = useState("All Platforms")
  const [difficulty, setDifficulty] = useState("All Difficulties")
  const [solvedBy, setSolvedBy] = useState("All")
  const [tag, setTag] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchProblems()
    }
  }, [status, query, platform, difficulty, solvedBy, tag])

  const fetchProblems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append("query", query)
      if (platform && platform !== "All Platforms" && platform !== "all") params.append("platform", platform)
      if (difficulty && difficulty !== "All Difficulties" && difficulty !== "all") params.append("difficulty", difficulty)
      if (solvedBy && solvedBy !== "All" && solvedBy !== "all") params.append("solvedBy", solvedBy)
      if (tag) params.append("tag", tag)
      
      const res = await fetch(`/api/problems?${params.toString()}`)
      const data = await res.json()
      
      if (Array.isArray(data)) {
        setProblems(data)
      } else {
        console.error("API Error:", data)
        setProblems([])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;
    try {
      const res = await fetch(`/api/problems/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProblems(problems.filter(p => p.id !== id))
      } else {
        console.error("Failed to delete problem")
      }
    } catch (e) {
      console.error("Failed to delete problem:", e)
    }
  }

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (status === "loading") return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">My Problems</h1>
        <Link href="/problems/new">
          <Button>Log New Problem</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 bg-card p-4 rounded-xl border shadow-sm items-center">
        <Input 
          placeholder="Search by title..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-[200px]"
        />
        <Input 
          placeholder="Filter by tag..." 
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="max-w-[150px]"
        />
        <Select value={platform} onValueChange={(val) => setPlatform(val || "All Platforms")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Platforms">All Platforms</SelectItem>
            <SelectItem value="LeetCode">LeetCode</SelectItem>
            <SelectItem value="Codeforces">Codeforces</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={(val) => setDifficulty(val || "All Difficulties")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Difficulties">All Difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={solvedBy} onValueChange={(val) => setSolvedBy(val || "All")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Solved By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="by me">By Me</SelectItem>
            <SelectItem value="editorial">Editorial</SelectItem>
            <SelectItem value="AI assisted">AI Assisted</SelectItem>
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
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {problems.map((problem: any) => (
            <motion.div key={problem.id} variants={item}>
              <Card className="h-full overflow-hidden border-white/10 bg-card/40 backdrop-blur-xl hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] hover:border-blue-500/30 transition-all duration-300 group">
                <CardHeader className="pb-3 border-b border-white/5 bg-white/5 dark:bg-black/20">
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
                  <div className="flex gap-2">
                    <span>{problem.platform}</span>
                    <span>•</span>
                    <span className="capitalize">{problem.solvedBy}</span>
                  </div>
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
                
                <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
                  <Link href={`/problems/${problem.id}/edit`}>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-primary">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-muted-foreground hover:text-red-500"
                    onClick={() => handleDelete(problem.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
