import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Star, Quote, TrendingUp, Users, Award, Building2, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export function SuccessStoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const graduateStories = [
    {
      id: 1,
      name: "Sarah Ahmed",
      role: "Marketing Graduate",
      university: "American University of Dubai",
      currentCompany: "TechCorp MENA",
      currentPosition: "Digital Marketing Specialist",
      story: "I completed 3 apprenticeships through the platform, starting with social media strategy for an NGO. The AI guidance was incredible - it broke down complex marketing concepts into manageable weekly tasks. Each project built on the previous one, and by the end, I had a portfolio that landed me interviews at 5 companies. The real-world experience made all the difference.",
      apprenticeships: ["Social Media Strategy", "Content Marketing", "Digital Analytics"],
      skills: ["Social Media", "Content Strategy", "Analytics", "SEO"],
      rating: 4.9,
      timeToEmployment: "2 months",
      salaryIncrease: "40%",
      badges: ["Top Performer", "Content Expert", "Analytics Pro"],
      category: "marketing"
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      role: "Computer Science Graduate",
      university: "University of Sharjah", 
      currentCompany: "StartupX",
      currentPosition: "Full-Stack Developer",
      story: "As a fresh graduate, I struggled to get interviews despite good grades. The mobile app development apprenticeship changed everything. Working on a real health-tracking app taught me more than any classroom project. The AI mentor helped me debug issues and suggested best practices. Now I'm building products that impact thousands of users daily.",
      apprenticeships: ["Mobile App Development", "API Integration", "Database Design"],
      skills: ["React Native", "Node.js", "MongoDB", "API Design"],
      rating: 4.8,
      timeToEmployment: "1 month",
      salaryIncrease: "50%",
      badges: ["Tech Innovator", "Problem Solver", "Full-Stack Pro"],
      category: "technology"
    },
    {
      id: 3,
      name: "Fatima Al-Zahra",
      role: "Business Graduate",
      university: "UAE University",
      currentCompany: "McKinsey & Company",
      currentPosition: "Business Analyst",
      story: "The market research apprenticeship with a consulting firm opened my eyes to the strategy world. Learning industry-standard methodologies while working on real client challenges was invaluable. The structured approach and weekly feedback helped me develop analytical thinking. My apprenticeship project became part of my consulting interview portfolio.",
      apprenticeships: ["Market Research", "Business Analysis", "Strategy Consulting"],
      skills: ["Market Research", "Data Analysis", "Strategy", "Presentation"],
      rating: 4.9,
      timeToEmployment: "3 months",
      salaryIncrease: "60%",
      badges: ["Research Expert", "Strategy Pro", "Consulting Ready"],
      category: "business"
    },
    {
      id: 4,
      name: "Omar Khalil",
      role: "Design Graduate",
      university: "American University of Beirut",
      currentCompany: "Freelance + Agencies",
      currentPosition: "Senior UX Designer",
      story: "The UI/UX apprenticeship was my first taste of real design work. Redesigning an e-commerce platform taught me user research, prototyping, and design systems. The AI feedback on my designs was surprisingly insightful. Six months later, I'm working with multiple agencies and have my own freelance clients.",
      apprenticeships: ["UI/UX Design", "User Research", "Design Systems"],
      skills: ["UI Design", "User Research", "Prototyping", "Design Systems"],
      rating: 4.7,
      timeToEmployment: "2 months",
      salaryIncrease: "45%",
      badges: ["Design Expert", "User Advocate", "Creative Pro"],
      category: "design"
    }
  ];

  const organizationStories = [
    {
      id: 1,
      name: "GreenTech Solutions",
      type: "Startup",
      industry: "Environmental Technology",
      story: "We needed a social media strategy but couldn't afford an agency. The apprenticeship program was perfect - we got high-quality work and found our next hire. Sarah's strategy increased our engagement by 500% and led to 3 new partnerships. We hired her full-time after the apprenticeship ended.",
      impact: "500% social engagement increase",
      outcome: "Graduate hired full-time",
      tasksCompleted: 3,
      successRate: "100%",
      costSavings: "$15,000",
      category: "startup"
    },
    {
      id: 2,
      name: "Clean Water Initiative",
      type: "NGO",
      industry: "Non-Profit",
      story: "Data analysis was always a challenge for our small team. The apprenticeship program connected us with a graduate who transformed our reporting. Ahmed created dashboards that help us track impact across 12 countries. The quality exceeded our expectations, and the cost was a fraction of consulting fees.",
      impact: "Real-time impact tracking",
      outcome: "Improved decision making",
      tasksCompleted: 5,
      successRate: "100%",
      costSavings: "$25,000",
      category: "ngo"
    },
    {
      id: 3,
      name: "Digital Services Department",
      type: "Government",
      industry: "Public Sector",
      story: "Improving citizen services required fresh perspectives. The apprenticeship program brought innovative ideas from young graduates. The portal redesign increased user satisfaction by 40% and reduced support tickets by 60%. The structured approach ensured quality deliverables on time.",
      impact: "40% improved satisfaction",
      outcome: "Better citizen services",
      tasksCompleted: 8,
      successRate: "94%",
      costSavings: "$50,000",
      category: "government"
    }
  ];

  const filteredGraduates = selectedCategory === "all" 
    ? graduateStories 
    : graduateStories.filter(story => story.category === selectedCategory);

  const filteredOrganizations = selectedCategory === "all"
    ? organizationStories
    : organizationStories.filter(story => story.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl lg:text-4xl tracking-tight">Success Stories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real graduates building careers and organizations achieving goals through AI-powered micro-apprenticeships
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {[
              { value: "all", label: "All Stories" },
              { value: "marketing", label: "Marketing" },
              { value: "technology", label: "Technology" },
              { value: "business", label: "Business" },
              { value: "design", label: "Design" },
              { value: "startup", label: "Startups" },
              { value: "ngo", label: "NGOs" },
              { value: "government", label: "Government" }
            ].map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-blue-600">87%</div>
            <div className="text-sm text-muted-foreground">Job Placement Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-green-600">4.8/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-purple-600">2.5 months</div>
            <div className="text-sm text-muted-foreground">Avg. Time to Employment</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-yellow-600">48%</div>
            <div className="text-sm text-muted-foreground">Avg. Salary Increase</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="graduates" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="graduates" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Graduate Stories
          </TabsTrigger>
          <TabsTrigger value="organizations" className="gap-2">
            <Building2 className="h-4 w-4" />
            Organization Stories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="graduates" className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredGraduates.map((story) => (
              <Card key={story.id} className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {story.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{story.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{story.role}</p>
                        <p className="text-xs text-muted-foreground">{story.university}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(story.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-white/70 p-4 rounded-lg">
                    <div className="text-sm text-green-600 mb-1">Currently:</div>
                    <div className="text-sm">{story.currentPosition}</div>
                    <div className="text-xs text-muted-foreground">{story.currentCompany}</div>
                  </div>

                  <div className="relative">
                    <Quote className="h-4 w-4 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{story.story}"
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-muted-foreground">Time to Job:</div>
                      <div className="text-green-600">{story.timeToEmployment}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Salary Increase:</div>
                      <div className="text-blue-600">{story.salaryIncrease}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Rating:</div>
                      <div className="text-yellow-600">{story.rating}/5</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Completed Apprenticeships:</div>
                    <div className="flex flex-wrap gap-1">
                      {story.apprenticeships.map((apprenticeship, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {apprenticeship}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Skills Gained:</div>
                    <div className="flex flex-wrap gap-1">
                      {story.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Badges Earned:</div>
                    <div className="flex flex-wrap gap-1">
                      {story.badges.map((badge, index) => (
                        <Badge key={index} className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredOrganizations.map((story) => (
              <Card key={story.id} className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{story.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{story.industry}</p>
                      <Badge variant="outline" className="text-xs w-fit mt-1">
                        {story.type}
                      </Badge>
                    </div>
                    <div className="bg-white/70 p-2 rounded-lg text-center">
                      <div className="text-lg text-green-600">{story.successRate}</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Quote className="h-4 w-4 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{story.story}"
                    </p>
                  </div>

                  <div className="bg-white/70 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Key Impact: {story.impact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Outcome: {story.outcome}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-muted-foreground">Tasks Completed:</div>
                      <div className="text-blue-600">{story.tasksCompleted}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Cost Savings:</div>
                      <div className="text-green-600">{story.costSavings}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Success Rate:</div>
                      <div className="text-purple-600">{story.successRate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="mt-12 border-2 border-dashed border-primary/20 bg-primary/5">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-xl">Ready to Write Your Success Story?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Join thousands of graduates and organizations already transforming careers and achieving goals
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link to="/browse-apprenticeships">Start Your Apprenticeship</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/post-task">Post Your Task</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}