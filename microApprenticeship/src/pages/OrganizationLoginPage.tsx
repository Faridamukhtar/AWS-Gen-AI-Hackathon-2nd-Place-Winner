import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Building2, Eye, EyeOff, Target } from "lucide-react";
import { Link } from "react-router-dom";

export function OrganizationLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    organizationName: "",
    organizationType: "",
    contactPerson: "",
    phone: "",
    website: ""
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl">Organization Portal</h1>
              <p className="text-xs text-muted-foreground">Post tasks & find talent</p>
            </div>
          </div>
        </div>

        {/* Login/Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? "Welcome Back" : "Register Your Organization"}
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              {isLogin 
                ? "Access your organization dashboard" 
                : "Join 500+ organizations finding talent through micro-apprenticeships"
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    placeholder="Your organization name"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Select 
                    value={formData.organizationType} 
                    onValueChange={(value: any) => setFormData({...formData, organizationType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization type" />
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
                  <Label htmlFor="contact">Contact Person</Label>
                  <Input
                    id="contact"
                    placeholder="Your full name"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+971 XX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="yoursite.com"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@yourorganization.com"
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
              <Link to="/organization-dashboard">
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
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm text-blue-800">Minimal Overhead</h4>
                <p className="text-xs text-blue-700">
                  AI handles project structuring, mentoring, and progress tracking. 
                  You focus on the results.
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