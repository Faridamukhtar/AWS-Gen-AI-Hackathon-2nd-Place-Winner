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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
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

  // 🔹 User profile state
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [idInput, setIdInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  // 🔹 Save user profile
  const handleSaveProfile = () => {
    if (!nameInput.trim() || !idInput.trim()) return;
    setUserProfile({
      id: idInput.trim(),
      name: nameInput.trim(),
      points: 0,
      skills: skillsInput
        .split(",")
        .map((s) => ({ skill: s.trim(), level: "beginner" }))
        .filter((s) => s.skill),
    });
    setOpenProfileDialog(false);
  };

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

  /* === Select task -> get milestones === */
  const handleSelectTask = async (task: Task) => {
    if (!userProfile) return; // block if no profile
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
      setMilestones([
        {
          id: "m1",
          title: "Milestone 1",
          action: "Finish AWS courses and build authentication layer",
          recommendedResources: ["AWS Docs", "SkillBuilder"],
          completed: false,
        },
      ]);
    } finally {
      setMilestonesLoading(false);
    }
  };

  /* === Submit Project to Company === */
  const handleCompanySubmit = async () => {
    if (!selectedTask || !userProfile) return;

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
    if (!selectedTask || !userProfile) return;

    const file = type === "milestone" && id ? fileByM[id] : finalFile;
    let fileContent = null;
    if (file) {
      const buffer = await file.arrayBuffer();
      fileContent = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    }

    let description = selectedTask.description || selectedTask.title || "";
    if (type === "milestone" && id) {
      const milestone = milestones.find((m) => m.id === id);
      if (milestone) description = milestone.action;
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
              ? { ...m, feedback, aiScore, completed: aiScore >= 80 }
              : m
          )
        );
      }

      if (type === "final") {
        setFinalScore(aiScore);
        setAiMsg(`✅ Final review complete: Score ${aiScore}/100 — ${feedback}`);
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
      {/* 🔹 Prompt for user profile */}
      <Dialog open={openProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome! Enter Your Details</DialogTitle>
            <DialogDescription>
              Please provide your profile information to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Your Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <Input
              placeholder="Your ID"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
            />
            <Input
              placeholder="Skills (comma separated)"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
            />
            <Button className="w-full" onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {userProfile && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {userProfile.name}</h1>
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
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
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

          {/* Milestones, Reviews, Submission */}
          {/* (unchanged logic, same as previous version) */}
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
