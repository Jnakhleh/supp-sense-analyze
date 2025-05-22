
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Gem, Lock, Bell, Package, User } from "lucide-react";
import { Link } from "react-router-dom";
import { getApiKey, setApiKey } from "@/services/aiService";
import { toast } from "sonner";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [name, setName] = useState("Jane Smith");
  const [email, setEmail] = useState("jane.smith@example.com");

  useEffect(() => {
    // Load the API key if it exists
    const savedKey = getApiKey() || localStorage.getItem("gemini_api_key") || "";
    setGeminiApiKey(savedKey);
  }, []);

  const handleSaveApiKey = () => {
    setApiKey(geminiApiKey);
    localStorage.setItem("gemini_api_key", geminiApiKey);
    toast.success("API key saved successfully");
  };

  const handleSavePersonalInfo = () => {
    // This would connect to a backend in a real implementation
    toast.success("Personal information updated successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Supasupp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Personal</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Gem className="w-4 h-4" />
              <span>AI Settings</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <Button onClick={handleSavePersonalInfo}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI Integration Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                  <p>Supasupp uses Google's Gemini AI API to provide personalized health assessments and recommendations. You'll need to provide your own API key to enable AI functionality.</p>
                  <p className="mt-2">Get your API key from the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                  <Input 
                    id="gemini-api-key" 
                    value={geminiApiKey} 
                    onChange={(e) => setGeminiApiKey(e.target.value)} 
                    placeholder="Enter your Gemini API key" 
                    type="password"
                  />
                  <p className="text-xs text-gray-500">Your API key is stored locally and never sent to our servers.</p>
                </div>
                
                <Button onClick={handleSaveApiKey} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                  <Gem className="w-4 h-4 mr-2" />
                  Save API Key
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates and reminders via email</p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        defaultChecked={true}
                        className="rounded border-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Product Updates</p>
                      <p className="text-sm text-gray-500">Be notified about new features and improvements</p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="product-updates"
                        type="checkbox"
                        defaultChecked={true}
                        className="rounded border-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Health Reminders</p>
                      <p className="text-sm text-gray-500">Get periodic reminders to reassess your health</p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="health-reminders"
                        type="checkbox"
                        defaultChecked={true}
                        className="rounded border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
