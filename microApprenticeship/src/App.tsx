import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { UserDashboard } from "./components/UserDashboard";
import { CompanyDashboard } from "./components/CompanyDashboard";
import { User, Building2, Sparkles } from "lucide-react";

export default function App() {
  const [activeView, setActiveView] = useState<"selection" | "user" | "company">("selection");

  if (activeView === "user") {
    return (
      <div className="min-h-screen min-w-screen bg-background">
        <nav className="border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-lg">GenAI Micro-Apprenticeship</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setActiveView("selection")}
            >
              Switch View
            </Button>
          </div>
        </nav>
        <main className="px-6 py-6 max-w-7xl mx-auto">
          <UserDashboard />
        </main>
      </div>
    );
  }

  if (activeView === "company") {
    return (
      <div className="min-h-screen min-w-screen bg-background">
        <nav className="border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-lg">GenAI Micro-Apprenticeship</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setActiveView("selection")}
            >
              Switch View
            </Button>
          </div>
        </nav>
        <main className="px-6 py-6 max-w-7xl mx-auto">
          <CompanyDashboard />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">GenAI Micro-Apprenticeship</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connecting graduates with SMEs and NGOs through AI-powered micro-apprenticeships
          </p>
          <p className="text-muted-foreground">
            Choose your role to explore the platform
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => setActiveView("user")}>
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl">Graduate/Job Seeker</h3>
                <p className="text-muted-foreground">
                  Discover AI-matched apprenticeships, complete milestones, and receive feedback
                </p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Profile setup with skills assessment</li>
                <li>• AI-matched task recommendations</li>
                <li>• Custom learning roadmaps</li>
                <li>• Real-time AI feedback</li>
                <li>• Rewards and rankings system</li>
              </ul>
              <Button className="w-full mt-4">
                Enter as Graduate
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => setActiveView("company")}>
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl">Company/SME/NGO</h3>
                <p className="text-muted-foreground">
                  Create tasks, review submissions, and select top talent
                </p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Create detailed task descriptions</li>
                <li>• View all task applications</li>
                <li>• AI-ranked submission reviews</li>
                <li>• Select winners and approve rewards</li>
                <li>• Track task performance</li>
              </ul>
              <Button className="w-full mt-4">
                Enter as Company
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Preview */}
        <div className="border-t pt-8 mt-12">
          <h2 className="text-lg mb-6">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <h4>AI-Powered Matching</h4>
              <p className="text-muted-foreground">
                Smart algorithms match graduates with relevant opportunities based on skills and experience
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <h4>Milestone-Based Learning</h4>
              <p className="text-muted-foreground">
                Structured learning paths with clear milestones and continuous feedback
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-5 h-5 text-pink-600" />
              </div>
              <h4>Quality Assurance</h4>
              <p className="text-muted-foreground">
                AI-assisted review and ranking system ensures high-quality outcomes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}