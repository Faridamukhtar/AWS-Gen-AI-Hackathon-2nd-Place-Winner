import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Clock, Users, Star, Calendar, Target, CheckCircle, 
  ArrowLeft, Bot, Award, Building2, GraduationCap 
} from "lucide-react";

export function ProjectDetailsPage() {
  const { id } = useParams();
  
  // Mock data - in real app this would come from API
  const project = {
    id: parseInt(id || "1"),
    title: "Social Media Strategy for NGO",
    organization: "Green Earth Initiative",
    type: "NGO",
    duration: "30 days",
    skills: ["Social Media", "Content Strategy", "Analytics"],
    difficulty: "Beginner",
    applicants: 12,
    rating: 4.8,
    budget: "Unpaid (Experience + Certificate)",
    description: "Develop a comprehensive social media strategy to increase environmental awareness and drive engagement with our sustainability campaigns. You'll work with real data and create content that impacts thousands of people.",
    objectives: [
      "Analyze current social media performance and identify improvement opportunities",
      "Develop a 3-month content calendar with engaging environmental campaigns",
      "Create social media templates and brand guidelines",
      "Implement analytics tracking and reporting system"
    ],
    deliverables: [
      "Social Media Audit Report",
      "3-Month Content Calendar",
      "Brand Guidelines Document",
      "Analytics Dashboard Setup",
      "Final Presentation to Leadership"
    ],
    aiStructure: {
      week1: {
        title: "Research & Analysis",
        tasks: [
          "Complete social media audit of current channels",
          "Analyze competitor strategies and best practices",
          "Research target audience demographics and preferences",
          "Submit weekly progress report"
        ],
        deliverable: "Social Media Audit Report"
      },
      week2: {
        title: "Strategy Development",
        tasks: [
          "Define social media objectives and KPIs",
          "Create content pillars and messaging framework",
          "Develop posting schedule and frequency plan",
          "Present strategy to mentor for feedback"
        ],
        deliverable: "Social Media Strategy Document"
      },
      week3: {
        title: "Content Creation",
        tasks: [
          "Design content calendar with 90 days of posts",
          "Create branded templates and visual guidelines",
          "Write sample posts and captions",
          "Set up analytics tracking system"
        ],
        deliverable: "Content Calendar & Templates"
      },
      week4: {
        title: "Implementation & Presentation",
        tasks: [
          "Finalize all deliverables and documentation",
          "Create executive summary and recommendations",
          "Prepare final presentation",
          "Present to organization leadership"
        ],
        deliverable: "Final Presentation & Handover"
      }
    },
    mentorInfo: {
      name: "Sarah Ahmed",
      role: "Digital Marketing Lead",
      experience: "5+ years",
      rating: 4.9
    },
    organizationInfo: {
      name: "Green Earth Initiative",
      type: "Environmental NGO",
      size: "50-100 employees",
      location: "Dubai, UAE",
      about: "Leading environmental NGO focused on sustainability education and climate action in the MENA region."
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6 gap-2" asChild>
        <Link to="/browse-apprenticeships">
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{project.type}</Badge>
                  <Badge className={
                    project.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                    project.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }>
                    {project.difficulty}
                  </Badge>
                </div>
                <h1 className="text-3xl tracking-tight">{project.title}</h1>
                <p className="text-lg text-muted-foreground">{project.organization}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {project.duration}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {project.applicants} applicants
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {project.rating}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="structure">AI Structure</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="mentor">Mentor</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expected Deliverables</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="structure" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI-Generated 30-Day Structure
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Our AI has structured this project into weekly sprints with clear milestones
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(project.aiStructure).map(([week, content], index) => (
                      <div key={week} className="relative">
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-100 text-blue-700 p-2 rounded-lg flex-shrink-0">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <h4 className="text-sm">Week {index + 1}: {content.title}</h4>
                              <Badge variant="outline" className="text-xs mt-1">
                                {content.deliverable}
                              </Badge>
                            </div>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {content.tasks.map((task, taskIndex) => (
                                <li key={taskIndex} className="flex items-start gap-2">
                                  <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {index < Object.entries(project.aiStructure).length - 1 && (
                          <div className="absolute left-5 top-12 w-px h-6 bg-border" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    About {project.organizationInfo.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <div>{project.organizationInfo.type}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <div>{project.organizationInfo.size}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <div>{project.organizationInfo.location}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Budget:</span>
                      <div>{project.budget}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.organizationInfo.about}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mentor" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Your Mentor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-sm">{project.mentorInfo.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.mentorInfo.role}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3 text-yellow-500" />
                          {project.mentorInfo.experience}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {project.mentorInfo.rating}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your mentor will provide weekly guidance, review your progress, and help you overcome challenges.
                        Most communication happens through our AI system, with human mentor intervention when needed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apply for This Apprenticeship</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Application Difficulty</span>
                  <Badge variant="outline">{project.difficulty}</Badge>
                </div>
                <Progress value={project.difficulty === "Beginner" ? 33 : project.difficulty === "Intermediate" ? 66 : 100} />
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{project.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span>Flexible</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applications:</span>
                  <span>{project.applicants} submitted</span>
                </div>
              </div>

              <Button size="lg" className="w-full gap-2">
                <GraduationCap className="h-4 w-4" />
                Apply Now
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                You'll need to complete a skills assessment and provide a motivation letter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What You'll Gain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Verified completion certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Portfolio-ready project deliverables</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Real-world industry experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Professional reference letter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Skill verification badges</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}