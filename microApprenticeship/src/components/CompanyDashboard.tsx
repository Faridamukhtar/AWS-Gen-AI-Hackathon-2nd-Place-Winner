import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Users, Calendar, Award, Brain, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function CompanyDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newReward, setNewReward] = useState<number | "">("");
  const [newDuration, setNewDuration] = useState("");

  // 🔹 Fetch tasks on load
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://5s3kpyaws4.execute-api.us-west-2.amazonaws.com/dev/generate-tasks");
        const data = await res.json();
        setTasks(data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // 🔹 Create new task via API
  const handleCreateTask = async () => {
    const newTask = {
      manara: Date.now().toString(),
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      status: "active",
      reward: Number(newReward) || 100,
      duration: newDuration || "1 week",
      skills: [],
      applicants: 0,
      topSubmissions: []
    };

    try {
      const res = await fetch("https://5s3kpyaws4.execute-api.us-west-2.amazonaws.com/dev/generate-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      setTasks(prev => [newTask, ...prev]); // optimistic update
      setIsDialogOpen(false);
      setNewTitle(""); setNewDescription(""); setNewReward(""); setNewDuration("");
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800";
      case "review": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Company Dashboard</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Enter the task details below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Task Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              <Textarea placeholder="Task Description" value={newDescription} onChange={e => setNewDescription(e.target.value)} rows={4} />
              <div className="flex gap-2">
                <Input placeholder="Reward" type="number" value={newReward} onChange={e => setNewReward(e.target.valueAsNumber)} />
                <Input placeholder="Duration" value={newDuration} onChange={e => setNewDuration(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tasks.map(task => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{task.description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{task.reward} points</span>
                  <span>{task.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {task.skills?.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {task.applicants || 0} applicants</div>
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {task.topSubmissions?.length || 0} submissions</div>
                </div>
                {task.winner && <div className="flex items-center gap-1 text-green-600"><Award className="w-4 h-4" /> Winner: {task.winner}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
