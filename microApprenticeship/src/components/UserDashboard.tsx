import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
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
import { CheckCircle, Upload, ChevronLeft } from "lucide-react";

/* ====== API Endpoints ====== */
const TASKS_API =
  "https://5s3kpyaws4.execute-api.us-west-2.amazonaws.com/dev/generate-tasks";
const AGENT_INPUT_API =
  "https://12iq9q7dzf.execute-api.us-west-2.amazonaws.com/prod/agent-input";
const MILESTONES_API =
  "https://12iq9q7dzf.execute-api.us-west-2.amazonaws.com/prod/generate-milestones";
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

type UserProfile = {
  id: string;
  name: string;
  points: number;
  skills: { skill: string; level: string }[];
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

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [idInput, setIdInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  /* === Save user profile === */
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

  /* === Select task -> get milestones from agent === */
  const handleSelectTask = async (task: Task) => {
    if (!userProfile) return;
    setSelectedTask(task);
    setMilestones([]);
    setMilestonesLoading(true);
    setFinalScore(null);
    setFinalFile(null);
    setFileByM({});
    setAiMsg(null);

    try {
      // Step 1: Post to agent-input
      const res = await fetch(AGENT_INPUT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: userProfile.skills,
          task: {
            title: task.title,
            description: task.description,
            reward: task.reward,
            duration: task.duration,
            skills: task.skills || [],
          },
        }),
      });

      if (!res.ok) throw new Error("Agent input API failed");
      const { requestId } = await res.json();

      // Step 2: Poll generate-milestones until completed
      const pollMilestones = async () => {
        const res2 = await fetch(
          `${MILESTONES_API}?requestId=${encodeURIComponent(requestId)}`
        );
        if (!res2.ok) throw new Error("Milestones API failed");

        const data = await res2.json();

        if (data.status !== "completed") {
          setTimeout(pollMilestones, 2000);
          return;
        }

        const normalized: Milestone[] = Object.entries(
          data.milestones || {}
        ).map(([key, val]: any, idx) => ({
          id: key,
          title: `Milestone ${idx + 1}`,
          action: val.action,
          recommendedResources: val.recommendedResources || [],
          completed: false,
        }));

        setMilestones(normalized);
        setMilestonesLoading(false);
      };

      pollMilestones();
    } catch (e: any) {
      console.error("Agent flow failed:", e);
      setErr("Could not load milestones");
      setMilestonesLoading(false);
    }
  };

  /* === Submit milestone or final for AI review === */
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
      description,
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
        setAiMsg(`✅ Milestone reviewed: Score ${aiScore}/100`);
      }

      if (type === "final") {
        setFinalScore(aiScore);
        setAiMsg(`✅ Final review complete: Score ${aiScore}/100 — ${feedback}`);
      }
    } catch (err: any) {
      setAiMsg(`❌ Review failed: ${err.message}`);
    }
  };

  /* === Submit final project to company === */
  const handleCompanySubmit = async () => {
    if (!selectedTask || !userProfile) return;

    const avgScore =
      milestones.length > 0
        ? milestones.reduce((acc, m) => acc + (m.aiScore || 0), 0) /
          milestones.length
        : finalScore || 0;

    const payload = {
      userId: userProfile.id,
      userName: userProfile.name,
      taskId: selectedTask.manara || selectedTask.id,
      totalScore: avgScore,
    };

    try {
      const res = await fetch(SUBMIT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setAiMsg(`📨 Project submitted to company: ${data.message || "Success!"}`);
    } catch (err: any) {
      setAiMsg(`❌ Submission failed: ${err.message}`);
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
      {/* Profile Dialog */}
      <Dialog open={openProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome! Enter Your Details</DialogTitle>
            <DialogDescription>
              Please provide your profile information to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Your Name</Label>
              <Input
                placeholder="e.g., Alex Johnson"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
            <div>
              <Label>Your Username</Label>
              <Input
                placeholder="e.g., user_123"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
              />
            </div>
            <div>
              <Label>Skills (comma separated)</Label>
              <Input
                placeholder="e.g., React, AWS, Python"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
            </div>
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
                    <span className="text-muted-foreground">
                      {task.duration}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Milestones View */}
          {selectedTask && (
            <>
              <Button variant="outline" onClick={() => setSelectedTask(null)}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back to Tasks
              </Button>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Path</CardTitle>
                  <CardDescription>
                    Complete milestones to finish this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {milestones.filter((m) => m.completed).length} /{" "}
                    {milestones.length} completed
                  </p>
                </CardContent>
              </Card>

              {milestonesLoading && (
                <p className="text-center py-4">Loading milestones…</p>
              )}

              {milestones.map((m, idx) => {
                const isLocked = idx > 0 && !milestones[idx - 1].completed;

                return (
                  <Card key={m.id}>
                    <CardHeader>
                      <CardTitle>{m.title}</CardTitle>
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
                        <div className={`p-3 rounded-lg space-y-2 ${m.aiScore && m.aiScore < 80 ? 'bg-amber-50' : 'bg-blue-50'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">AI Feedback</span>
                            <span className={`text-sm font-medium ${m.aiScore && m.aiScore < 80 ? 'text-amber-700' : 'text-blue-700'}`}>
                              Score: {m.aiScore}/100
                            </span>
                          </div>
                          <p className={`text-sm ${m.aiScore && m.aiScore < 80 ? 'text-amber-800' : 'text-blue-800'}`}>{m.feedback}</p>
                          {m.aiScore && m.aiScore < 80 && (
                            <p className="text-xs text-amber-600 mt-2">
                              ⚠️ Please review the feedback and resubmit to pass this milestone
                            </p>
                          )}
                        </div>
                      )}

                      {!m.completed && !isLocked && (
                        <>
                          <div className="p-3 bg-gray-50 rounded-lg mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              💡 Submission Tips:
                            </p>
                            <p className="text-xs text-gray-600">
                              Make sure your code directly addresses this milestone's requirements. The AI will check if your submission matches what's requested.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label>Upload Solution</Label>
                            <Input
                              type="file"
                              onChange={(e) =>
                                setFileByM((prev) => ({
                                  ...prev,
                                  [m.id]: e.target.files?.[0] || null,
                                }))
                              }
                            />
                            {fileByM[m.id] && (
                              <p className="text-sm text-muted-foreground">
                                Selected: {fileByM[m.id]!.name}
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={() => handleReview("milestone", m.id)}
                            disabled={!fileByM[m.id]}
                          >
                            <Upload className="w-4 h-4 mr-2" /> Submit for AI
                            Review
                          </Button>
                        </>
                      )}

                      {m.completed && (
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <CheckCircle className="w-4 h-4" /> Completed
                        </div>
                      )}

                      {!m.completed && m.aiScore !== undefined && m.aiScore < 80 && !isLocked && (
                        <>
                          <div className="p-3 bg-amber-50 rounded-lg mb-3">
                            <p className="text-sm font-medium text-amber-700">
                              ⚠️ Score below 80 - Please resubmit
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label>Resubmit Solution</Label>
                            <Input
                              type="file"
                              onChange={(e) =>
                                setFileByM((prev) => ({
                                  ...prev,
                                  [m.id]: e.target.files?.[0] || null,
                                }))
                              }
                            />
                          </div>
                          <Button
                            onClick={() => handleReview("milestone", m.id)}
                            disabled={!fileByM[m.id]}
                          >
                            <Upload className="w-4 h-4 mr-2" /> Resubmit for Review
                          </Button>
                        </>
                      )}

                      {isLocked && (
                        <p className="text-sm text-gray-500 italic">
                          🔒 Complete the previous milestone to unlock this
                          step.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {/* Final Project Submission */}
              {milestones.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Final Project Submission</CardTitle>
                    <CardDescription>
                      Submit your complete project for AI review, then submit
                      to company
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Final Project Guidelines:
                      </p>
                      <p className="text-xs text-gray-600">
                        Your final submission should integrate all milestone work into a complete, cohesive project that meets the task requirements.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Final Project</Label>
                      <Input
                        type="file"
                        onChange={(e) =>
                          setFinalFile(e.target.files?.[0] || null)
                        }
                      />
                      {finalFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {finalFile.name}
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() => handleReview("final")}
                      className="w-full"
                      disabled={!finalFile}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {finalScore !== null ? "Resubmit Final Project" : "Submit Final Project for AI Review"}
                    </Button>

                    {finalScore !== null && (
                      <div className="space-y-3">
                        <div className={`p-3 border rounded-lg ${finalScore >= 80 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                          <p className={`text-sm ${finalScore >= 80 ? 'text-green-800' : 'text-amber-800'}`}>
                            Final AI Score: {finalScore}/100
                          </p>
                        </div>

                        {finalScore >= 80 ? (
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleCompanySubmit}
                          >
                            Submit Project to Company
                          </Button>
                        ) : (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800">
                              Score must be 80 or higher to submit to company. Please review the feedback above and resubmit.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}

      {/* AI Messages */}
      {aiMsg && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{aiMsg}</p>
        </div>
      )}
    </div>
  );
}