import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Plus, Users, Clock, CheckCircle, TrendingUp, 
  Target, Calendar, Star, Building2, Bot 
} from "lucide-react";
import { Link } from "react-router-dom";

export function OrganizationDashboardPage() {
  const activeTasks = [
    {
      id: 1,
      title: "Social Media Strategy Development",
      applicants: 12,
      selected: "Sarah Ahmed",
      progress: 75,
      week: 3,
      nextDeadline: "Content Calendar Submission",
      daysLeft: 2
    },
    {
      id: 2,
      title: "Market Research Analysis",
      applicants: 8,
      selected: "Ahmed Hassan",
      progress: 40,
      week: 2,
      nextDeadline: "Research Methodology Review",
      daysLeft: 5
    }
  ];

  const completedTasks = [
    {
      id: 3,
      title: "Website UI/UX Redesign",
      graduate: "Fatima Al-Zahra",
      completedDate: "2024-01-15",
      rating: 4.8,
      outcome: "Hired full-time"
    },
    {
      id: 4,
      title: "Digital Marketing Campaign",
      graduate: "Omar Khalil",
      completedDate: "2023-12-20",
      rating: 4.6,
      outcome: "Project extended"
    }
  ];

  const applications = [
    {
      taskTitle: "Data Analysis for Customer Insights",
      applicant: "Layla Mansour",
      university: "UAE University",
      skills: ["Data Analysis", "Python", "Visualization"],
      rating: 4.7,
      applied: "2 days ago"
    },
    {
      taskTitle: "Data Analysis for Customer Insights",
      applicant: "Khalid Ibrahim",
      university: "AUB",
      skills: ["Data Analysis", "R", "Statistics"],
      rating: 4.5,
      applied: "3 days ago"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl tracking-tight">Organization Dashboard</h1>
            <p className="text-muted-foreground">Manage your tasks and track apprenticeship progress</p>
          </div>
          <Button className="gap-2" asChild>
            <Link to="/post-task">
              <Plus className="h-4 w-4" />
              Post New Task
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-lg">5</div>
                  <div className="text-xs text-muted-foreground">Active Tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-lg">23</div>
                  <div className="text-xs text-muted-foreground">Total Applicants</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-lg">12</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
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
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active Tasks</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {activeTasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">Assigned to: {task.selected}</p>
                      </div>
                      <Badge>Week {task.week}/4</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Applicants:</span>
                        <div>{task.applicants}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Milestone:</span>
                        <div>{task.nextDeadline}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Due in:</span>
                        <div>{task.daysLeft} days</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Progress
                      </Button>
                      <Button size="sm" variant="outline">
                        Message Graduate
                      </Button>
                      <Button size="sm" variant="outline">
                        Review Work
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {activeTasks.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="text-muted-foreground">No active tasks</div>
                      <Button asChild>
                        <Link to="/post-task">Post Your First Task</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <div className="space-y-4">
                {applications.map((app, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div>
                            <h4 className="text-sm">{app.taskTitle}</h4>
                            <p className="text-xs text-muted-foreground">Applied {app.applied}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {app.applicant.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm">{app.applicant}</div>
                              <div className="text-xs text-muted-foreground">{app.university}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{app.rating}</span>
                            </div>
                            <div className="flex gap-1">
                              {app.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                          <Button size="sm">
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="text-sm">{task.title}</h4>
                          <p className="text-xs text-muted-foreground">Completed by: {task.graduate}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{task.rating}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">{task.outcome}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Completed</div>
                          <div className="text-xs">{task.completedDate}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">Quality Increase</div>
                <div className="text-xs text-blue-700">
                  Projects with structured AI guidance show 40% higher completion rates
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800">Talent Pipeline</div>
                <div className="text-xs text-green-700">
                  3 graduates from your completed projects are now hire-ready
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-800">Optimization Tip</div>
                <div className="text-xs text-purple-700">
                  Consider posting similar tasks to your highest-rated projects
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link to="/post-task">
                  <Plus className="h-4 w-4" />
                  Post New Task
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Browse Graduates
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Review
              </Button>
            </CardContent>
          </Card>

          {/* Organization Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organization Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm">Green Earth Initiative</h4>
                  <p className="text-xs text-muted-foreground">Environmental NGO</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profile Completion:</span>
                  <span>90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Tasks Posted:</span>
                  <div>17</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Success Rate:</span>
                  <div>94%</div>
                </div>
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