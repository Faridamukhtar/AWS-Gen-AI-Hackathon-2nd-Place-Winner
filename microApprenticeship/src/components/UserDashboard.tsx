import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CheckCircle, Upload, Brain, ChevronLeft, Lock } from "lucide-react";

/* ====== Endpoints ====== */
const TASKS_API =
  "https://5s3kpyaws4.execute-api.us-west-2.amazonaws.com/dev/generate-tasks";
const AGENT_API =
  "https://5s3kpyaws4.execute-api.us-west-2.amazonaws.com/dev/agent-milestones";
const REVIEW_API =
  "https://5s3kpyaws4.execute-api.us-west-2.amazonaws.com/dev/get-feedback";
const SUBMIT_API =
  "https://5s3kpyaws4.execute-api.us-west-2.amazonaws.com/dev/submit-solution";

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
  manara: any;
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
  aiScore?: number;
  completed?: boolean;
};

export default function UserDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [aiMsg, setAiMsg] = useState<string | null>(null);

  const [fileByM, setFileByM] = useState<Record<string, File | null>>({});
  const [finalFile, setFinalFile] = useState<File | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);

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

      if (!res.ok) throw new Error("Agent API failed");

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
    } catch (e) {
      console.warn("Agent API failed, using mock milestones", e);

      const mockData = {
        milestones: {
          milestone1: {
            action: "Finish AWS courses and build authentication layer",
            recommendedResources: ["Manara AWS", "IBM SkillBuilder"],
          },
          milestone2: {
            action: "Integrate AI model into chatbot system",
            recommendedResources: ["Manara AI", "AWS AI Services"],
          },
          milestone3: {
            action: "Prepare final documentation and testing",
            recommendedResources: ["OpenAI Docs", "AWS Testing Framework"],
          },
        },
      };

      const normalized: Milestone[] = Object.entries(mockData.milestones).map(
        ([key, val]: any, idx) => ({
          id: key,
          title: `Milestone ${idx + 1}`,
          action: val.action,
          recommendedResources: val.recommendedResources,
          completed: false,
        })
      );

      setMilestones(normalized);
    } finally {
      setMilestonesLoading(false);
    }
  };

  /* === Submit Project to Company === */
  const handleCompanySubmit = async () => {
    if (!selectedTask) return;

    const avgScore =
      milestones.reduce((acc, m) => acc + (m.aiScore || 0), 0) /
      milestones.length;

    const payload = {
      userId: userProfile.id,
      taskId: selectedTask.manara,
      totalScore: avgScore,
    };

    try {
      const res = await fetch(SUBMIT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setAiMsg(`📨 Project submitted to company: ${data.message}`);
    } catch (err: any) {
      setAiMsg(`❌ Submission failed: ${err.message}`);
    }
  };

  /* === Ask for AI Review (milestone or final) === */
  const handleReview = async (type: "milestone" | "final", id?: string) => {
    if (!selectedTask) return;

    const file = type === "milestone" && id ? fileByM[id] : finalFile;
    let fileContent = null;
    if (file) {
      const buffer = await file.arrayBuffer();
      fileContent = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    }

    // ✅ Use milestone.action as description for milestone reviews
    let description = selectedTask.description || selectedTask.title || "";
    if (type === "milestone" && id) {
      const milestone = milestones.find((m) => m.id === id);
      if (milestone) {
        description = milestone.action;
      }
    }

    const payload = {
      userId: userProfile.id,
      taskId: selectedTask.id,
      milestoneId: id,
      description: description,
      fileContent,
    };

    try {
      const res = await fetch(REVIEW_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const feedback = data.feedback || "No feedback";
      const aiScore = data.aiScore || 0;

      if (type === "milestone" && id) {
        setMilestones((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  feedback,
                  aiScore,
                  completed: aiScore >= 80, // ✅ auto-complete if score good
                }
              : m
          )
        );
      }

      if (type === "final") {
        setFinalScore(aiScore);
        setAiMsg(
          `✅ Final review complete: Score ${aiScore}/100 — ${feedback}`
        );
      }
    } catch (err: any) {
      setAiMsg(`Review failed: ${err.message}`);
    }
  };

  const progress =
    milestones.length > 0
      ? Math.round(
          (milestones.filter((m) => m.completed).length / milestones.length) *
            100
        )
      : 0;

  const allMilestonesDone =
    milestones.length > 0 && milestones.every((m) => m.completed);

  /* === UI === */
  if (loading) return <p className="p-8">Loading tasks…</p>;
  if (err) return <p className="text-red-600 p-8">Error: {err}</p>;

  return (
    <div className="space-y-6 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {userProfile.name}
          </h1>
          {selectedTask ? (
            <p className="text-muted-foreground">
              Viewing: {selectedTask.title}
            </p>
          ) : (
            <p className="text-muted-foreground">
              Select a task to view milestones
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold">{userProfile.points} points</span>
          <Avatar>
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Task List */}
      {!selectedTask && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSelectTask(task)}
            >
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between text-sm">
                <span className="font-medium">{task.reward} points</span>
                <span className="text-muted-foreground">{task.duration}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Milestones */}
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
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </CardContent>
          </Card>

          {milestonesLoading && (
            <p className="text-center py-4">Loading milestones…</p>
          )}

          {milestones.map((m, idx) => {
            const isLocked = idx > 0 && !milestones[idx - 1].completed;
            return (
              <Card
                key={m.id}
                className={`mt-4 ${isLocked ? "opacity-50" : ""}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{m.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">Step {idx + 1}</Badge>
                      {isLocked && (
                        <Badge className="bg-gray-200 text-gray-700 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{m.action}</p>
                  {!isLocked && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Recommended:</span>{" "}
                      {m.recommendedResources.join(", ")}
                    </div>
                  )}
                  {m.feedback && (
                    <div className="p-3 bg-blue-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                          <Brain className="w-4 h-4" /> AI Feedback
                        </span>
                        {m.aiScore !== undefined && (
                          <Badge
                            className={
                              m.aiScore >= 80
                                ? "bg-green-100 text-green-800"
                                : m.aiScore >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            Score: {m.aiScore}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-blue-800">{m.feedback}</p>
                    </div>
                  )}
                  {!m.completed && !isLocked && (
                    <>
                      <div className="space-y-2">
                        <Label>Upload Your Work</Label>
                        <Input
                          type="file"
                          onChange={(e) =>
                            setFileByM((s) => ({
                              ...s,
                              [m.id]: e.target.files?.[0] || null,
                            }))
                          }
                        />
                      </div>
                      <Button onClick={() => handleReview("milestone", m.id)}>
                        <Upload className="w-4 h-4 mr-2" /> Submit for AI Review
                      </Button>
                    </>
                  )}
                  {m.completed && (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </div>
                  )}
                  {isLocked && !m.completed && (
                    <p className="text-sm text-gray-500 italic">
                      🔒 Complete the previous milestone to unlock this step.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Final Project */}
          {milestones.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Final Project Submission</CardTitle>
                <CardDescription>
                  Submit your complete project for AI review first
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!allMilestonesDone && (
                  <p className="text-sm text-gray-500 italic">
                    🔒 Complete all milestones to unlock final submission
                  </p>
                )}
                {allMilestonesDone && (
                  <>
                    <div className="space-y-2">
                      <Label>Upload Final Project</Label>
                      <Input
                        type="file"
                        onChange={(e) =>
                          setFinalFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                    <Button
                      onClick={() => handleReview("final")}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Submit Final Project
                      for AI Review
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submit to Company */}
          {finalScore !== null && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Final AI Score: {finalScore}/100
              </p>
              <Button
                className="w-full mt-2 bg-green-600 text-white"
                onClick={handleCompanySubmit}
                disabled={finalScore < 80}
              >
                🚀 Submit Project to Company
              </Button>
            </div>
          )}
        </>
      )}

      {aiMsg && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4">
          <p className="text-sm text-blue-800">{aiMsg}</p>
        </div>
      )}
    </div>
  );
}
