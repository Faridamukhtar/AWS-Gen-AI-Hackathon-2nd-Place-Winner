import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Clock, Users, Star, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";

export function BrowseApprenticeshipsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const apprenticeships = [
    {
      id: 1,
      title: "Social Media Strategy for NGO",
      organization: "Green Earth Initiative",
      type: "NGO",
      duration: "30 days",
      skills: ["Social Media", "Content Strategy", "Analytics"],
      difficulty: "Beginner",
      applicants: 12,
      rating: 4.8,
      description: "Develop a comprehensive social media strategy to increase environmental awareness and drive engagement with our sustainability campaigns."
    },
    {
      id: 2,
      title: "E-commerce Product Research",
      organization: "TechStart Solutions",
      type: "Startup",
      duration: "30 days", 
      skills: ["Market Research", "Data Analysis", "Presentation"],
      difficulty: "Intermediate",
      applicants: 8,
      rating: 4.9,
      description: "Conduct market research to identify trending products and analyze competitor strategies for our e-commerce platform."
    },
    {
      id: 3,
      title: "Mobile App UI/UX Design",
      organization: "HealthTech Startup",
      type: "Startup",
      duration: "30 days",
      skills: ["UI Design", "User Research", "Prototyping"],
      difficulty: "Advanced",
      applicants: 15,
      rating: 4.7,
      description: "Design user-friendly interfaces for our health tracking mobile application, focusing on accessibility and user experience."
    },
    {
      id: 4,
      title: "Digital Marketing Campaign",
      organization: "Local Business Hub",
      type: "SME",
      duration: "30 days",
      skills: ["Digital Marketing", "SEO", "Content Creation"],
      difficulty: "Intermediate",
      applicants: 20,
      rating: 4.6,
      description: "Create and execute a digital marketing campaign to promote local businesses and increase their online presence."
    },
    {
      id: 5,
      title: "Data Analysis for Public Health",
      organization: "Health Ministry",
      type: "Government",
      duration: "30 days",
      skills: ["Data Analysis", "Statistics", "Visualization"],
      difficulty: "Advanced",
      applicants: 6,
      rating: 4.9,
      description: "Analyze public health data to identify trends and create visualizations for policy decision-making."
    },
    {
      id: 6,
      title: "Community Outreach Program",
      organization: "Youth Development Center",
      type: "NGO",
      duration: "30 days",
      skills: ["Community Engagement", "Event Planning", "Communication"],
      difficulty: "Beginner",
      applicants: 18,
      rating: 4.5,
      description: "Design and implement a community outreach program to engage youth in educational and recreational activities."
    }
  ];

  const filteredApprenticeship = apprenticeships.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = selectedSkill === "all" || 
                        item.skills.some(skill => skill.toLowerCase().includes(selectedSkill.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === "all" || 
                             item.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    
    return matchesSearch && matchesSkill && matchesDifficulty;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl tracking-tight">Browse Apprenticeships</h1>
          <p className="text-lg text-muted-foreground">
            Find your perfect 30-day micro-apprenticeship with AI-powered guidance
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search apprenticeships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="social media">Social Media</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="data analysis">Data Analysis</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="research">Research</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {filteredApprenticeship.length} of {apprenticeships.length} apprenticeships
          </p>
          
          <Badge variant="secondary" className="gap-1">
            <Filter className="h-3 w-3" />
            Active filters: {[selectedSkill, selectedDifficulty].filter(f => f !== "all").length}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApprenticeship.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {project.difficulty}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{project.organization}</p>
                  <Badge variant="secondary" className="text-xs w-fit">
                    {project.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {project.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.applicants} applicants
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {project.rating}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {project.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Button size="sm" className="w-full" asChild>
                    <Link to={`/project/${project.id}`}>
                      View Details & Apply
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApprenticeship.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No apprenticeships match your current filters.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setSelectedSkill("all");
                setSelectedDifficulty("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}