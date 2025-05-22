
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Brain, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Assessment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const steps = [
    {
      title: "Basic Information",
      description: "Let's start with some basic details about you"
    },
    {
      title: "Health Goals",
      description: "What are your primary health objectives?"
    },
    {
      title: "Current Health Status",
      description: "Tell us about your current health situation"
    },
    {
      title: "Lifestyle & Diet",
      description: "Understanding your daily habits and nutrition"
    },
    {
      title: "AI Follow-up Questions",
      description: "Personalized questions based on your responses",
      isAI: true
    }
  ];

  const updateAnswer = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to results
      navigate("/results", { state: { answers } });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={answers.age || ""}
                  onChange={(e) => updateAnswer("age", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => updateAnswer("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter your height"
                  value={answers.height || ""}
                  onChange={(e) => updateAnswer("height", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight"
                  value={answers.weight || ""}
                  onChange={(e) => updateAnswer("weight", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="activity_level">Activity Level</Label>
              <Select onValueChange={(value) => updateAnswer("activity_level", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="high">High (heavy exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="very-high">Very High (very heavy exercise/physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="health_goals">Primary Health Goals (Select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {[
                  "Improve energy levels",
                  "Better sleep quality",
                  "Weight management",
                  "Immune system support",
                  "Mental clarity & focus",
                  "Stress management",
                  "Heart health",
                  "Digestive health",
                  "Joint & bone health",
                  "Skin health",
                  "Athletic performance",
                  "General wellness"
                ].map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={goal}
                      checked={answers.health_goals?.includes(goal) || false}
                      onChange={(e) => {
                        const currentGoals = answers.health_goals || [];
                        if (e.target.checked) {
                          updateAnswer("health_goals", [...currentGoals, goal]);
                        } else {
                          updateAnswer("health_goals", currentGoals.filter((g: string) => g !== goal));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="specific_concerns">Specific Health Concerns</Label>
              <Textarea
                id="specific_concerns"
                placeholder="Describe any specific health issues, symptoms, or concerns you'd like to address..."
                value={answers.specific_concerns || ""}
                onChange={(e) => updateAnswer("specific_concerns", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="medical_conditions">Known Medical Conditions</Label>
              <Textarea
                id="medical_conditions"
                placeholder="List any diagnosed medical conditions, allergies, or chronic issues..."
                value={answers.medical_conditions || ""}
                onChange={(e) => updateAnswer("medical_conditions", e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="medications">Current Medications & Supplements</Label>
              <Textarea
                id="medications"
                placeholder="List all medications, vitamins, and supplements you're currently taking..."
                value={answers.medications || ""}
                onChange={(e) => updateAnswer("medications", e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="energy_level">Current Energy Level (1-10 scale)</Label>
              <Select onValueChange={(value) => updateAnswer("energy_level", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate your average energy level" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level} - {level <= 3 ? "Low" : level <= 6 ? "Moderate" : level <= 8 ? "Good" : "Excellent"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sleep_quality">Sleep Quality</Label>
              <Select onValueChange={(value) => updateAnswer("sleep_quality", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="How would you rate your sleep?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor - Difficulty falling asleep, frequent waking</SelectItem>
                  <SelectItem value="fair">Fair - Some sleep issues, not very restful</SelectItem>
                  <SelectItem value="good">Good - Generally sleep well</SelectItem>
                  <SelectItem value="excellent">Excellent - Sleep deeply and wake refreshed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="diet_type">Diet Type</Label>
              <Select onValueChange={(value) => updateAnswer("diet_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="omnivore">Omnivore (eat everything)</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="keto">Ketogenic</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stress_level">Stress Level (1-10 scale)</Label>
              <Select onValueChange={(value) => updateAnswer("stress_level", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate your average stress level" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level} - {level <= 3 ? "Low stress" : level <= 6 ? "Moderate stress" : level <= 8 ? "High stress" : "Very high stress"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="water_intake">Daily Water Intake</Label>
              <Select onValueChange={(value) => updateAnswer("water_intake", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="How much water do you drink daily?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less-than-4">Less than 4 glasses</SelectItem>
                  <SelectItem value="4-6">4-6 glasses</SelectItem>
                  <SelectItem value="6-8">6-8 glasses</SelectItem>
                  <SelectItem value="more-than-8">More than 8 glasses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="digestive_issues">Digestive Issues</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {[
                  "Bloating",
                  "Gas",
                  "Constipation",
                  "Diarrhea",
                  "Acid reflux",
                  "Food sensitivities",
                  "None"
                ].map((issue) => (
                  <div key={issue} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={issue}
                      checked={answers.digestive_issues?.includes(issue) || false}
                      onChange={(e) => {
                        const currentIssues = answers.digestive_issues || [];
                        if (e.target.checked) {
                          updateAnswer("digestive_issues", [...currentIssues, issue]);
                        } else {
                          updateAnswer("digestive_issues", currentIssues.filter((i: string) => i !== issue));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={issue} className="text-sm">{issue}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 bg-blue-100 px-2 py-1 rounded">AI Generated Questions</span>
              </div>
              <p className="text-blue-700">
                Based on your responses, our AI has generated personalized follow-up questions to better understand your health profile.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="ai_question_1">Given your energy concerns and stress levels, how do you typically feel in the afternoon?</Label>
                <Select onValueChange={(value) => updateAnswer("ai_question_1", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your typical afternoon experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="energetic">Still energetic and focused</SelectItem>
                    <SelectItem value="slight-dip">Slight energy dip but manageable</SelectItem>
                    <SelectItem value="tired">Noticeably tired and sluggish</SelectItem>
                    <SelectItem value="crash">Significant crash, need caffeine/snacks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ai_question_2">Do you experience any of these symptoms regularly?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {[
                    "Brain fog",
                    "Mood swings",
                    "Cravings for sugar",
                    "Difficulty concentrating",
                    "Frequent colds",
                    "Joint stiffness",
                    "None of the above"
                  ].map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={symptom}
                        checked={answers.ai_symptoms?.includes(symptom) || false}
                        onChange={(e) => {
                          const currentSymptoms = answers.ai_symptoms || [];
                          if (e.target.checked) {
                            updateAnswer("ai_symptoms", [...currentSymptoms, symptom]);
                          } else {
                            updateAnswer("ai_symptoms", currentSymptoms.filter((s: string) => s !== symptom));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="supplement_experience">Have you tried supplements before? What was your experience?</Label>
                <Textarea
                  id="supplement_experience"
                  placeholder="Tell us about any supplements you've tried, what worked, what didn't, and any side effects..."
                  value={answers.supplement_experience || ""}
                  onChange={(e) => updateAnswer("supplement_experience", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="mt-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            {steps[currentStep]?.isAI && (
              <div className="flex justify-center mb-4">
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <Brain className="w-4 h-4" />
                  <span>AI Powered</span>
                </div>
              </div>
            )}
            <CardTitle className="text-2xl font-bold text-gray-900">
              {steps[currentStep]?.title}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {steps[currentStep]?.description}
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            {renderStepContent()}
            
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white flex items-center space-x-2"
              >
                <span>{currentStep === steps.length - 1 ? "Get My Recommendations" : "Next"}</span>
                {currentStep === steps.length - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;
