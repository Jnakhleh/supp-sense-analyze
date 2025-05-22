
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, RefreshCw, Star, Clock, TrendingUp, Shield, Heart, Loader2 } from "lucide-react";
import { generateHealthAnalysis, generateRecommendations, getApiKey } from "@/services/aiService";
import { toast } from "sonner";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers || {};
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [healthAnalysis, setHealthAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      // Check if we have answers to analyze
      if (Object.keys(answers).length === 0) {
        toast.error("No assessment data found. Please complete the assessment first.");
        navigate("/assessment");
        return;
      }

      // Check for API key before making requests
      const apiKey = getApiKey() || localStorage.getItem("gemini_api_key");
      
      if (!apiKey) {
        toast.error("No API key found. Please add your Gemini API key in profile settings.", {
          action: {
            label: "Go to Settings",
            onClick: () => navigate("/profile")
          }
        });
        // Load fallback results
        setRecommendations(generateRecommendationsFromMock());
        setHealthAnalysis(`
          Based on your comprehensive health assessment, our AI has identified several key patterns in your health profile:

          **Energy & Metabolic Health**: Your reported afternoon energy crashes combined with stress levels suggest potential issues with blood sugar regulation and adrenal function. The combination of moderate stress levels and suboptimal sleep quality creates a cycle that impacts your energy production at the cellular level.

          **Nutritional Gaps**: Your dietary patterns and lifestyle factors indicate likely deficiencies in key nutrients, particularly vitamin D, magnesium, and B-vitamins. These deficiencies commonly occur together and compound each other's effects on energy and mood.

          **Sleep & Recovery**: Your sleep quality assessment reveals opportunities for improvement in recovery and restoration. Poor sleep quality directly impacts hormone production, immune function, and cognitive performance.

          **Digestive Health**: The digestive symptoms you mentioned suggest gut microbiome imbalance, which affects nutrient absorption and can contribute to systemic inflammation and immune dysfunction.

          **Stress Response**: Your stress levels, combined with the other factors, indicate your body may be in a chronic state of low-level stress, depleting key nutrients and affecting your body's ability to recover and maintain optimal function.
        `);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Parallel API calls to improve loading time
        const [analysisResult, recommendationsResult] = await Promise.all([
          generateHealthAnalysis(answers),
          generateRecommendations(answers)
        ]);
        
        setHealthAnalysis(analysisResult);
        setRecommendations(addIconsToRecommendations(recommendationsResult));
      } catch (error) {
        console.error("Error generating results:", error);
        // Use fallback data in case of errors
        setRecommendations(generateRecommendationsFromMock());
        toast.error("There was an error generating your recommendations. Using sample data instead.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [answers, navigate]);

  const addIconsToRecommendations = (recs: any[]) => {
    const icons = {
      "vitamin": <Star className="w-5 h-5" />,
      "magnesium": <Clock className="w-5 h-5" />,
      "omega": <Heart className="w-5 h-5" />,
      "b-complex": <TrendingUp className="w-5 h-5" />,
      "probiotic": <Shield className="w-5 h-5" />,
      "default": <Star className="w-5 h-5" />
    };

    return recs.map(rec => {
      const name = rec.name.toLowerCase();
      let icon = icons.default;
      
      if (name.includes("vitamin")) icon = icons.vitamin;
      else if (name.includes("magnesium")) icon = icons.magnesium;
      else if (name.includes("omega")) icon = icons.omega;
      else if (name.includes("b-complex") || name.includes("b complex")) icon = icons["b-complex"];
      else if (name.includes("probiotic")) icon = icons.probiotic;
      
      return {...rec, icon};
    });
  };

  // Mock AI-generated recommendations based on user answers
  const generateRecommendationsFromMock = () => {
    const recommendations = [
      {
        id: 1,
        name: "Vitamin D3",
        dosage: "2000 IU daily",
        priority: "high",
        category: "Basic Essentials",
        reason: "Based on your energy concerns and lifestyle, vitamin D deficiency is likely contributing to fatigue and mood issues.",
        benefits: ["Energy support", "Immune function", "Mood regulation"],
        timing: "Take with breakfast for better absorption",
        icon: <Star className="w-5 h-5" />
      },
      {
        id: 2,
        name: "Magnesium Glycinate",
        dosage: "400mg before bed",
        priority: "high",
        category: "Basic Essentials",
        reason: "Your stress levels and sleep quality indicate magnesium deficiency, which affects both relaxation and energy production.",
        benefits: ["Better sleep", "Stress reduction", "Muscle relaxation"],
        timing: "Take 30 minutes before bedtime",
        icon: <Clock className="w-5 h-5" />
      },
      {
        id: 3,
        name: "Omega-3 EPA/DHA",
        dosage: "1000mg daily",
        priority: "medium",
        category: "Basic Essentials",
        reason: "Essential for brain health, inflammation reduction, and cardiovascular support based on your health goals.",
        benefits: ["Brain function", "Heart health", "Anti-inflammatory"],
        timing: "Take with meals to reduce fishy aftertaste",
        icon: <Heart className="w-5 h-5" />
      },
      {
        id: 4,
        name: "B-Complex",
        dosage: "1 capsule daily",
        priority: "medium",
        category: "Advanced Support",
        reason: "Your afternoon energy crashes suggest B-vitamin deficiencies, particularly B12 and folate.",
        benefits: ["Energy metabolism", "Nervous system support", "Mental clarity"],
        timing: "Take with breakfast for sustained energy",
        icon: <TrendingUp className="w-5 h-5" />
      },
      {
        id: 5,
        name: "Probiotic Complex",
        dosage: "10 billion CFU daily",
        priority: "medium",
        category: "Advanced Support",
        reason: "Your digestive symptoms indicate gut microbiome imbalance affecting nutrient absorption and immunity.",
        benefits: ["Digestive health", "Immune support", "Nutrient absorption"],
        timing: "Take on empty stomach, 30 minutes before breakfast",
        icon: <Shield className="w-5 h-5" />
      }
    ];

    return recommendations;
  };

  const highPriority = recommendations.filter(r => r.priority === "high");
  const mediumPriority = recommendations.filter(r => r.priority === "medium");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-8" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Your Results</h2>
        <p className="text-gray-600 max-w-md text-center">
          Our AI is processing your health data to create personalized recommendations just for you.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/assessment" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Assessment</span>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            <span>Assessment Complete</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Personalized Supplement Plan</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on your health profile, our AI has analyzed your responses and created evidence-based recommendations tailored specifically for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Health Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Analysis */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span>AI Health Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose text-gray-700 whitespace-pre-line">
                  {healthAnalysis}
                </div>
              </CardContent>
            </Card>

            {/* High Priority Recommendations */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-700">🔥 High Priority Recommendations</CardTitle>
                <p className="text-gray-600">Start with these supplements for the most immediate impact on your health.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {highPriority.map((rec) => (
                  <div key={rec.id} className="border border-red-200 rounded-lg p-6 bg-red-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {rec.icon}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{rec.name}</h3>
                          <p className="text-sm text-gray-600">{rec.dosage}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{rec.reason}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Benefits:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rec.benefits.map((benefit: string, index: number) => (
                            <li key={index} className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Best Time to Take:</h4>
                        <p className="text-sm text-gray-600">{rec.timing}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Medium Priority Recommendations */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-yellow-700">⭐ Additional Support</CardTitle>
                <p className="text-gray-600">These supplements provide additional benefits once you've established the high-priority ones.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {mediumPriority.map((rec) => (
                  <div key={rec.id} className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {rec.icon}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{rec.name}</h3>
                          <p className="text-sm text-gray-600">{rec.dosage}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{rec.reason}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Benefits:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rec.benefits.map((benefit: string, index: number) => (
                            <li key={index} className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Best Time to Take:</h4>
                        <p className="text-sm text-gray-600">{rec.timing}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Recommendations:</span>
                  <span className="font-semibold">{recommendations.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High Priority:</span>
                  <span className="font-semibold text-red-600">{highPriority.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Medium Priority:</span>
                  <span className="font-semibold text-yellow-600">{mediumPriority.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Monthly Cost:</span>
                  <span className="font-semibold text-green-600">$45-75</span>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">1</span>
                    </div>
                    <p className="text-sm text-gray-600">Start with high-priority supplements first</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">2</span>
                    </div>
                    <p className="text-sm text-gray-600">Give each supplement 2-4 weeks to show effects</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">3</span>
                    </div>
                    <p className="text-sm text-gray-600">Add medium-priority supplements gradually</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">4</span>
                    </div>
                    <p className="text-sm text-gray-600">Retake assessment in 3 months to track progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-lg">
              <CardContent className="pt-6 space-y-3">
                <Link to="/assessment" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake Assessment
                  </Button>
                </Link>
                <Link to="/" className="w-full">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
