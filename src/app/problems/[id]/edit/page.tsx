"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { status } = useSession();
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [initialUrl, setInitialUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const defaultFormState = {
    title: "",
    platform: "",
    difficulty: "Medium",
    solvedBy: "by me",
    tags: "",
    keyInsights: "",
    mistakes: "",
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [initialFormData, setInitialFormData] = useState(defaultFormState);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && id) fetchProblemDetails();
  }, [status, id]);

  const fetchProblemDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/problems/${id}`);
      if (!res.ok) throw new Error("Failed to fetch problem");
      const data = await res.json();

      const fetchedUrl = data.url ?? "";
      setUrl(fetchedUrl);
      setInitialUrl(fetchedUrl);

      const fetchedFormData = {
        title: data.title ?? "",
        platform: data.platform ?? "",
        difficulty: data.difficulty ?? "Medium",
        solvedBy: data.solvedBy ?? "by me",
        tags: (data.tags ?? []).join(", "),
        keyInsights: data.keyInsights ?? "",
        mistakes: data.mistakes ?? "",
      };

      setFormData(fetchedFormData);
      setInitialFormData(fetchedFormData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const parsedTags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/problems/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          ...formData,
          tags: parsedTags,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update problem");
      }
      router.push("/problems");
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) return null;

  // --- Change Detection Logic ---
  const changed = {
    solvedBy: formData.solvedBy !== initialFormData.solvedBy,
    tags: formData.tags !== initialFormData.tags,
    keyInsights: formData.keyInsights !== initialFormData.keyInsights,
    mistakes: formData.mistakes !== initialFormData.mistakes,
  };

  const hasChanges = Object.values(changed).some(Boolean);

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      {/* Header */}
      <div
        className="space-y-1"
        style={{ fontFamily: "var(--font-atkinson-mono), monospace" }}
      >
        <Link
          href="/problems"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to problems
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Edit problem</h1>
        <p className="text-base text-muted-foreground">
          Update your notes, insights, or other details.
        </p>
      </div>

      <div
        className="border border-border rounded-2xl overflow-hidden"
        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">
                Problem URL
              </Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled // CHANGED: Disabled editing
                required
                className="text-base rounded-xl h-11 transition-colors"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            {/* Title + Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  disabled // CHANGED: Disabled editing
                  required
                  className="text-base rounded-xl h-11 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(v) =>
                    setFormData({ ...formData, platform: v ?? "" })
                  }
                  disabled // CHANGED: Disabled editing
                >
                  <SelectTrigger className="text-base rounded-xl h-11 transition-colors">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      fontFamily: "var(--font-atkinson-mono), monospace",
                    }}
                  >
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
                <Select
                  value={formData.difficulty}
                  onValueChange={(v) =>
                    setFormData({ ...formData, difficulty: v ?? "Medium" })
                  }
                  disabled // CHANGED: Disabled editing
                >
                  <SelectTrigger className="text-base rounded-xl h-11 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      fontFamily: "var(--font-atkinson-mono), monospace",
                    }}
                  >
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Solved by</Label>
                <Select
                  value={formData.solvedBy}
                  onValueChange={(v) =>
                    setFormData({ ...formData, solvedBy: v ?? "by me" })
                  }
                >
                  <SelectTrigger
                    className={`text-base rounded-xl h-11 transition-colors ${changed.solvedBy ? "border-emerald-500 focus:ring-emerald-500" : ""}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      fontFamily: "var(--font-atkinson-mono), monospace",
                    }}
                  >
                    <SelectItem value="By me">By me</SelectItem>
                    <SelectItem value="Editorial">Editorial</SelectItem>
                    <SelectItem value="AI assisted">AI assisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags{" "}
                <span className="text-muted-foreground font-normal">
                  (comma-separated)
                </span>
              </Label>
              <Input
                id="tags"
                placeholder="binary search, dynamic programming…"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value,
                  })
                }
                className={`text-base rounded-xl h-11 transition-colors ${changed.tags ? "border-emerald-500 focus-visible:ring-emerald-500" : ""}`}
              />
            </div>

            {/* Key Insights */}
            <div className="space-y-2">
              <Label htmlFor="insights" className="text-sm font-medium">
                Key insights
              </Label>
              <textarea
                id="insights"
                rows={3}
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 resize-none transition-colors ${changed.keyInsights ? "border-emerald-500 focus-visible:ring-emerald-500" : "border-input focus-visible:ring-ring"}`}
                placeholder="What was the key insight to solve this?"
                value={formData.keyInsights}
                onChange={(e) =>
                  setFormData({ ...formData, keyInsights: e.target.value })
                }
              />
            </div>

            {/* Mistakes */}
            <div className="space-y-2">
              <Label htmlFor="mistakes" className="text-sm font-medium">
                Mistakes & pitfalls
              </Label>
              <textarea
                id="mistakes"
                rows={3}
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 resize-none transition-colors ${changed.mistakes ? "border-emerald-500 focus-visible:ring-emerald-500" : "border-input focus-visible:ring-ring"}`}
                placeholder="What edge cases or mistakes should you remember?"
                value={formData.mistakes}
                onChange={(e) =>
                  setFormData({ ...formData, mistakes: e.target.value })
                }
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-card flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              asChild
              className="rounded-xl text-base"
            >
              <Link href="/problems">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={submitting || !hasChanges}
              className="rounded-xl text-base px-6"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
