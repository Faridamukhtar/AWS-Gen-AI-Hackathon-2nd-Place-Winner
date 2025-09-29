import { useEffect, useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CheckCircle, Upload, Brain, ChevronLeft } from "lucide-react";

/* ====== Endpoints ====== */
const TASKS_API = "https://5s3kpyaws4.execute-api.us-west-2.amazonaws.com/dev/generate-tasks";
const AGENT_API = "https://5s3kpyaws4.execute-api.us-west-2.amazonaws.com/dev/agent-milestones";
const REVIEW_API = "https://5s3kpyaws4.execute-api.us-west-2.amazonaws.com/dev/review";

/* ====== Mock User Profile ====== */
const userProfile = {
  id: "user_123",
  name: "Alex Johnson",
  points: 1250,
  skills: [
    { skill: "React", level: "intermediate" },
    { skill: "AWS", level: "beginner" },
  ],
};

/* ====== Types ====== */
type Task = {
  id: string | number;
  title: string;
  description?: string;
  reward?: number;
  duration?: string;
  skills?: string[];
  status?: string;
};

type Milestone = {
  id: string;
  title: string;
  action: string;
  recommendedResources: string[];
  feedback?: string;
  completed?: boolean;
};

export function UserDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [aiMsg, setAiMsg] = useState<string | null>(null);

  const [descByM, setDescByM] = useState<Record<string, string>>({});
  const [fileByM, setFileByM] = useState<Record<string, File | null>>({});
  const [finalDesc, setFinalDesc] = useState("");
  const [finalFile, setFinalFile] = useState<File | null>(null);

  /* === Fetch all tasks === */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(TASKS_API);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const json = await res.json();
        setTasks(Array.isArray(json) ? json : []);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* === Select task -> get milestones from Agent === */
  const handleSelectTask = async (task: Task) => {
    setSelectedTask(task);
    setMilestones([]);
    setMilestonesLoading(true);
    try {
      const res = await fetch(AGENT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userProfile.id, task }),
      });
      if (!res.ok) throw new Error("Agent error");
      const data = await res.json();
      const normalized: Milestone[] = Object.entries(data.milestones || {}).map(
        ([key, val]: any, idx) => ({
          id: key,
          title: `Milestone ${idx + 1}`,
          action: val.action,
          recommendedResources: val.recommendedResources,
          completed: false,
        })
      );
      setMilestones(normalized);
    } catch (e: any) {
      setAiMsg(e.message);
    } finally {
      setMilestonesLoading(false);
    }
  };

  /* === Ask for AI Review (milestone or final) === */
  const handleReview = async (type: "milestone" | "final", id?: string) => {
    if (!selectedTask) return;
    try {
      setAiMsg("Sending for AI review...");
      const body = new FormData();
      body.append("userId", userProfile.id);
      body.append("taskId", String(selectedTask.id));
      if (type === "milestone" && id) {
        body.append("milestoneId", id);
        body.append("description", descByM[id] || "");
        if (fileByM[id]) body.append("file", fileByM[id]!);
      }
      if (type === "final") {
        body.append("description", finalDesc);
        if (finalFile) body.append("file", finalFile);
      }

      const res = await fetch(REVIEW_API, { method: "POST", body });
      const data = await res.json();
      if (type === "milestone" && id) {
        setMilestones((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, feedback: data.feedback, completed: true } : m
          )
        );
      }
      if (type === "final") {
        setAiMsg(`Final review: AI Score ${data.aiScore}, Rank ${data.rank}`);
      } else {
        setAiMsg(data.feedback || "AI review complete.");
      }
    } catch (e: any) {
      setAiMsg(`Review failed: ${e.message}`);
    }
  };

  const progress =
    milestones.length > 0
      ? Math.round((milestones.filter((m) => m.completed).length / milestones.length) * 100)
      : 0;

  /* === UI === */
  if (loading) return <p>Loading tasks…</p>;
  if (err) return <p className="text-red-600">Error: {err}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Welcome back, {userProfile.name}</h1>
          {selectedTask ? (
            <p className="text-muted-foreground">Viewing: {selectedTask.title}</p>
          ) : (
            <p className="text-muted-foreground">Select a task to view milestones</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>{userProfile.points} points</span>
          <Avatar><AvatarFallback>AJ</AvatarFallback></Avatar>
        </div>
      </div>

      {/* Task List */}
      {!selectedTask && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="cursor-pointer hover:shadow-md"
                  onClick={() => handleSelectTask(task)}>
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between text-sm">
                <span>{task.reward} points</span>
                <span>{task.duration}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Milestones View */}
      {selectedTask && (
        <>
          <Button variant="outline" onClick={() => setSelectedTask(null)}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to tasks
          </Button>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{selectedTask.title}</CardTitle>
              <CardDescription>{selectedTask.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} />
            </CardContent>
          </Card>

          {milestonesLoading && <p>Loading milestones…</p>}

          {milestones.map((m, idx) => (
            <Card key={m.id} className="mt-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{m.title}</CardTitle>
                  <Badge variant="outline">Step {idx + 1}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{m.action}</p>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={descByM[m.id] || ""}
                    onChange={(e) => setDescByM((s) => ({ ...s, [m.id]: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      setFileByM((s) => ({ ...s, [m.id]: e.target.files?.[0] || null }))
                    }
                  />
                  {fileByM[m.id] && <p>{fileByM[m.id]!.name}</p>}
                </div>
                <Button onClick={() => handleReview("milestone", m.id)}>
                  <Upload className="w-4 h-4 mr-2" /> Ask AI Review
                </Button>
                {m.feedback && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Brain className="w-4 h-4 text-blue-600 inline mr-2" />
                    {m.feedback}
                  </div>
                )}
                {m.completed && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" /> Completed
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Final Project Submission */}
          {milestones.length > 0 && (
            <Card className="mt-6">
              <CardHeader><CardTitle>Final Project Submission</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your final project..."
                  value={finalDesc}
                  onChange={(e) => setFinalDesc(e.target.value)}
                />
                <Input type="file" onChange={(e) => setFinalFile(e.target.files?.[0] || null)} />
                {finalFile && <p>{finalFile.name}</p>}
                <Button onClick={() => handleReview("final")}>
                  <Upload className="w-4 h-4 mr-2" /> Submit Final for AI Review
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {aiMsg && <p className="text-sm text-blue-600">{aiMsg}</p>}
    </div>
  );
}
