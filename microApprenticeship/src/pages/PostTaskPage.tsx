import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { Bot, Clock, Users, Target, CheckCircle, Sparkles } from "lucide-react";

export function PostTaskPage() {
  const [formData, setFormData] = useState({
    organizationType: "",
    organizationName: "",
    contactEmail: "",
    taskTitle: "",
    taskDescription: "",
    skills: [],
    deliverables: "",
    timeline: "30",
    difficulty: "",
    budget: "",
    mentorshipLevel: ""
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [aiPreview, setAiPreview] = useState(false);

  const skillOptions = [
    "Social Media", "Content Creation", "Digital Marketing", "SEO", "Data Analysis",
    "UI/UX Design", "Web Development", "Mobile Development", "Graphic Design",
    "Market Research", "Business Analysis", "Project Management", "Writing",
    "Translation", "Video Editing", "Photography", "Customer Service"
  ];

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const generateAIPreview = () => {
    setAiPreview(true);
  };

  const aiStructuredTask = {
    week1: "Research and Planning Phase - Understand project requirements, conduct initial research, and create project roadmap",
    week2: "Development Phase - Begin core work, implement initial solutions, and iterate based on feedback",
    week3: "Implementation Phase - Complete main deliverables, conduct testing, and refine outputs",
    week4: "Finalization Phase - Polish deliverables, prepare final presentation, and submit completed work"
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl tracking-tight">Post a Task</h1>
          <p className="text-lg text-muted-foreground">
            Transform your business challenge into a structured 30-day apprenticeship
          </p>
        </div>
        
        <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Bot className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-blue-800">
            Our AI will automatically structure your task into weekly sprints with clear milestones and rubrics
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Select value={formData.organizationType} onValueChange={(value: any) => setFormData({...formData, organizationType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="sme">SME</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    placeholder="Your organization name"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@yourorganization.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Task Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Task Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Social Media Strategy for Environmental Campaign"
                  value={formData.taskTitle}
                  onChange={(e) => setFormData({...formData, taskTitle: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Task Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project in detail. What needs to be accomplished? What are the goals? What resources will you provide?"
                  rows={6}
                  value={formData.taskDescription}
                  onChange={(e) => setFormData({...formData, taskDescription: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skillOptions.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <Label htmlFor={skill} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverables">Expected Deliverables</Label>
                <Textarea
                  id="deliverables"
                  placeholder="What specific outputs do you expect? (e.g., strategy document, prototype, analysis report)"
                  rows={3}
                  value={formData.deliverables}
                  onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={formData.difficulty} onValueChange={(value: any) => setFormData({...formData, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range (Optional)</Label>
                  <Select value={formData.budget} onValueChange={(value: any) => setFormData({...formData, budget: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Unpaid (Experience Only)</SelectItem>
                      <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                      <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                      <SelectItem value="2500+">$2,500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Preview */}
          {formData.taskTitle && formData.taskDescription && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!aiPreview ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      See how AI will structure your task into a 30-day apprenticeship
                    </p>
                    <Button onClick={generateAIPreview} className="gap-2">
                      <Bot className="h-4 w-4" />
                      Generate AI Structure
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">AI has structured your task into weekly sprints</span>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(aiStructuredTask).map(([week, description], index) => (
                        <div key={week} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Week {index + 1}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button size="lg" className="flex-1">
              Post Task
            </Button>
            <Button variant="outline" size="lg">
              Save Draft
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-700 p-1 rounded-full">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm">AI Processing</h4>
                  <p className="text-xs text-muted-foreground">Your task is structured into weekly sprints with clear milestones</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-700 p-1 rounded-full">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm">Graduate Applications</h4>
                  <p className="text-xs text-muted-foreground">Qualified graduates apply based on skills and interests</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-700 p-1 rounded-full">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm">Project Execution</h4>
                  <p className="text-xs text-muted-foreground">30-day structured apprenticeship with AI guidance and weekly check-ins</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Success Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Be specific about your goals and expectations</p>
              <p>• Provide clear context about your organization</p>
              <p>• List all relevant skills and tools</p>
              <p>• Define measurable deliverables</p>
              <p>• Be available for weekly check-ins</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}