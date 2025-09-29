import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { GraduationCap, Eye, EyeOff, Bot } from "lucide-react";
import { Link } from "react-router-dom";

export function GraduateLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    university: "",
    major: "",
    graduationYear: ""
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl">Graduate Portal</h1>
              <p className="text-xs text-muted-foreground">Start your apprenticeship journey</p>
            </div>
          </div>
        </div>

        {/* Login/Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? "Welcome Back" : "Create Your Account"}
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              {isLogin 
                ? "Sign in to continue your apprenticeship journey" 
                : "Join thousands of graduates building their careers"
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      placeholder="Your university"
                      value={formData.university}
                      onChange={(e) => setFormData({...formData, university: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Graduation Year</Label>
                    <Input
                      id="year"
                      placeholder="2024"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">Field of Study</Label>
                  <Input
                    id="major"
                    placeholder="e.g., Computer Science, Business, Marketing"
                    value={formData.major}
                    onChange={(e) => setFormData({...formData, major: e.target.value})}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Forgot password?
                </Button>
              </div>
            )}

            <Button size="lg" className="w-full" asChild>
              <Link to="/graduate-dashboard">
                {isLogin ? "Sign In" : "Create Account"}
              </Link>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" size="sm">
                Google
              </Button>
              <Button variant="outline" size="sm">
                LinkedIn
              </Button>
            </div>

            <div className="text-center text-sm">
              {isLogin ? (
                <span>
                  Don't have an account?{" "}
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up
                  </Button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto"
                    onClick={() => setIsLogin(true)}
                  >
                    Sign in
                  </Button>
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bot className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm text-green-800">AI-Powered Learning</h4>
                <p className="text-xs text-green-700">
                  Get personalized guidance, instant feedback, and structured learning paths 
                  tailored to your career goals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Button variant="link" size="sm" className="p-0 h-auto text-xs">
            Terms of Service
          </Button>{" "}
          and{" "}
          <Button variant="link" size="sm" className="p-0 h-auto text-xs">
            Privacy Policy
          </Button>
        </div>
      </div>
    </div>
  );
}