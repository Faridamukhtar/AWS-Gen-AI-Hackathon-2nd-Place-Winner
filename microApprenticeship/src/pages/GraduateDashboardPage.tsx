import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Calendar, Clock, Award, TrendingUp, CheckCircle, 
  BookOpen, Target, Users, Star, AlertCircle 
} from "lucide-react";
import { Link } from "react-router-dom";

export function GraduateDashboardPage() {
  const currentApprenticeship = {
    id: 1,
    title: "Social Media Strategy for NGO",
    organization: "Green Earth Initiative",
    progress: 75,
    currentWeek: 3,
    totalWeeks: 4,
    nextDeadline: "Submit Content Calendar",
    daysLeft: 2
  };

  const completedApprenticeship = [
    {
      id: 2,
      title: "Market Research Analysis",
      organization: "TechStart Solutions",
      completedDate: "2024-01-15",
      rating: 4.8,
      badge: "Research Expert"
    },
    {
      id: 3,
      title: "Digital Marketing Campaign",
      organization: "Local Business Hub",
      completedDate: "2023-12-10",
      rating: 4.6,
      badge: "Marketing Pro"
    }
  ];

  const upcomingTasks = [
    {
      task: "Complete social media audit analysis",
      deadline: "Today",
      priority: "high"
    },
    {
      task: "Submit weekly progress report",
      deadline: "Tomorrow",
      priority: "medium"
    },
    {
      task: "Schedule mentor check-in meeting",
      deadline: "In 3 days",
      priority: "low"
    }
  ];

  const skills = [
    { name: "Social Media Marketing", level: 85, verified: true },
    { name: "Data Analysis", level: 70, verified: true },
    { name: "Content Strategy", level: 60, verified: false },
    { name: "Market Research", level: 90, verified: true }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl tracking-tight">Welcome back, Sarah!</h1>
            <p className="text-muted-foreground">Continue building your professional portfolio</p>
          </div>
          <Button asChild>
            <Link to="/browse-apprenticeships">Browse New Projects</Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-lg">3</div>
                  <div className="text-xs text-muted-foreground">Active Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-lg">8</div>
                  <div className="text-xs text-muted-foreground">Badges Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <div>
                  <div className="text-lg">4.7</div>
                  <div className="text-xs text-muted-foreground">Avg Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-lg">92%</div>
                  <div className="text-xs text-muted-foreground">Completion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="current" className="space-y-6">
            <TabsList>
              <TabsTrigger value="current">Current Project</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6">
              {/* Current Apprenticeship */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{currentApprenticeship.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{currentApprenticeship.organization}</p>
                    </div>
                    <Badge>Week {currentApprenticeship.currentWeek}/4</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{currentApprenticeship.progress}%</span>
                    </div>
                    <Progress value={currentApprenticeship.progress} />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <div>
                        <div className="text-sm">Next Deadline</div>
                        <div className="text-xs text-muted-foreground">{currentApprenticeship.nextDeadline}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                      {currentApprenticeship.daysLeft} days left
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link to={`/project/${currentApprenticeship.id}`}>View Project</Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      Submit Work
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    This Week's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="bg-blue-600 text-white p-1 rounded text-xs">MON</div>
                      <div className="flex-1">
                        <div className="text-sm">Complete competitor analysis</div>
                        <div className="text-xs text-muted-foreground">Research Phase</div>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="bg-blue-600 text-white p-1 rounded text-xs">WED</div>
                      <div className="flex-1">
                        <div className="text-sm">Submit content calendar draft</div>
                        <div className="text-xs text-muted-foreground">Development Phase</div>
                      </div>
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-gray-400 text-white p-1 rounded text-xs">FRI</div>
                      <div className="flex-1">
                        <div className="text-sm">Mentor feedback session</div>
                        <div className="text-xs text-muted-foreground">Review & Iterate</div>
                      </div>
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="space-y-4">
                {completedApprenticeship.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="text-sm">{project.title}</h4>
                          <p className="text-xs text-muted-foreground">{project.organization}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{project.rating}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">{project.badge}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Completed</div>
                          <div className="text-xs">{project.completedDate}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Highlights</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Showcase your best work from completed apprenticeships
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm">Social Media Strategy</div>
                      <div className="text-xs text-muted-foreground">Green Earth Initiative</div>
                      <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                        View Project →
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm">Market Research Report</div>
                      <div className="text-xs text-muted-foreground">TechStart Solutions</div>
                      <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                        View Project →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm">{task.task}</div>
                    <div className="text-xs text-muted-foreground">{task.deadline}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{skill.name}</span>
                    <div className="flex items-center gap-1">
                      {skill.verified && <Award className="h-3 w-3 text-yellow-500" />}
                      <span className="text-xs">{skill.level}%</span>
                    </div>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm">Sarah Ahmed</h4>
                  <p className="text-xs text-muted-foreground">Marketing Graduate</p>
                  <p className="text-xs text-muted-foreground">American University of Dubai</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profile Completion:</span>
                  <span>95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}