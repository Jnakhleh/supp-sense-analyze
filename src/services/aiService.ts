
import { toast } from "sonner";

// Types for AI service responses
type FollowUpQuestion = {
  id: string;
  question: string;
  type: "text" | "select" | "checkbox" | "scale";
  options?: string[];
};

type Recommendation = {
  id: number;
  name: string;
  dosage: string;
  priority: "high" | "medium" | "low";
  category: string;
  reason: string;
  benefits: string[];
  timing: string;
  icon?: JSX.Element;
};

type HealthAnalysis = string;

// Default API key - this should ideally be stored in environment variables or Supabase secrets
let apiKey = ""; // User will need to provide this

export const setApiKey = (key: string) => {
  apiKey = key;
};

export const getApiKey = () => {
  return apiKey;
};

const callGeminiAPI = async (prompt: string) => {
  if (!apiKey) {
    toast.error("No API key provided. Please add your Gemini API key in settings.");
    throw new Error("No API key provided");
  }

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      toast.error(`API Error: ${data.error.message}`);
      throw new Error(data.error.message);
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    toast.error("Failed to get AI response. Please try again later.");
    throw error;
  }
};

export const generateFollowUpQuestions = async (previousAnswers: Record<string, any>): Promise<FollowUpQuestion[]> => {
  const prompt = `
    You are a health assessment AI that generates personalized follow-up questions based on user health data.
    
    Based on these answers from a health assessment:
    ${JSON.stringify(previousAnswers, null, 2)}
    
    Generate 3 relevant follow-up questions that would help understand this person's health needs better.
    
    For each question, provide:
    1. A clear question text
    2. The appropriate question type (one of: "text", "select", "checkbox", "scale")
    3. If the type is "select" or "checkbox", provide relevant options
    
    Format your response as valid JSON that matches this TypeScript type:
    type FollowUpQuestion = {
      id: string; // Generate a unique string ID
      question: string;
      type: "text" | "select" | "checkbox" | "scale";
      options?: string[]; // Include only for select and checkbox types
    }[];
    
    Return ONLY the JSON array with no additional text or explanation.
  `;

  try {
    const response = await callGeminiAPI(prompt);
    // Parse the JSON response - handle potential errors if not valid JSON
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", response);
      toast.error("Received invalid response format from AI. Using fallback questions.");
      // Return fallback questions
      return [
        {
          id: "fallback_1",
          question: "Do you experience any changes in your energy levels throughout the day?",
          type: "text"
        },
        {
          id: "fallback_2",
          question: "How would you rate your stress management techniques?",
          type: "scale"
        },
        {
          id: "fallback_3",
          question: "What specific health areas are you most concerned about?",
          type: "text"
        }
      ];
    }
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    // Return fallback questions if API call fails
    return [
      {
        id: "fallback_1",
        question: "Do you experience any changes in your energy levels throughout the day?",
        type: "text"
      },
      {
        id: "fallback_2",
        question: "How would you rate your stress management techniques?",
        type: "scale"
      },
      {
        id: "fallback_3",
        question: "What specific health areas are you most concerned about?",
        type: "text"
      }
    ];
  }
};

export const generateHealthAnalysis = async (answers: Record<string, any>): Promise<HealthAnalysis> => {
  const prompt = `
    You are a health analysis AI that identifies potential root causes of health issues.
    
    Based on this health assessment data:
    ${JSON.stringify(answers, null, 2)}
    
    Provide a comprehensive health analysis that identifies patterns and potential root causes of health issues.
    Format the response in markdown with sections for different health aspects (Energy & Metabolic Health, Nutritional Gaps, Sleep & Recovery, etc.).
    Be specific and insightful, focusing on connecting the user's symptoms and lifestyle factors with potential underlying issues.
    
    Return the analysis as a detailed markdown text with no additional wrapper text.
  `;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error("Error generating health analysis:", error);
    return `
    Based on your comprehensive health assessment, our AI has identified several key patterns in your health profile:

    **Energy & Metabolic Health**: Your reported afternoon energy crashes combined with stress levels suggest potential issues with blood sugar regulation and adrenal function. The combination of moderate stress levels and suboptimal sleep quality creates a cycle that impacts your energy production at the cellular level.

    **Nutritional Gaps**: Your dietary patterns and lifestyle factors indicate likely deficiencies in key nutrients, particularly vitamin D, magnesium, and B-vitamins. These deficiencies commonly occur together and compound each other's effects on energy and mood.

    **Sleep & Recovery**: Your sleep quality assessment reveals opportunities for improvement in recovery and restoration. Poor sleep quality directly impacts hormone production, immune function, and cognitive performance.

    **Digestive Health**: The digestive symptoms you mentioned suggest gut microbiome imbalance, which affects nutrient absorption and can contribute to systemic inflammation and immune dysfunction.

    **Stress Response**: Your stress levels, combined with the other factors, indicate your body may be in a chronic state of low-level stress, depleting key nutrients and affecting your body's ability to recover and maintain optimal function.
    `;
  }
};

export const generateRecommendations = async (answers: Record<string, any>): Promise<Recommendation[]> => {
  const prompt = `
    You are a health supplement recommendation AI that provides evidence-based supplement suggestions.
    
    Based on this health assessment data:
    ${JSON.stringify(answers, null, 2)}
    
    Generate personalized supplement recommendations with the following information for each:
    - name: The name of the supplement (e.g., "Vitamin D3")
    - dosage: Recommended dosage (e.g., "2000 IU daily")
    - priority: Priority level ("high", "medium", or "low")
    - category: Category (e.g., "Basic Essentials" or "Advanced Support")
    - reason: A detailed explanation of why this supplement is recommended based on their assessment data
    - benefits: An array of 3 key benefits (e.g., ["Energy support", "Immune function", "Mood regulation"])
    - timing: Best time to take the supplement (e.g., "Take with breakfast for better absorption")
    
    Provide at least 5 recommendations, with at least 2 high priority ones.
    
    Format your response as valid JSON that matches this TypeScript type:
    type Recommendation = {
      id: number;
      name: string;
      dosage: string;
      priority: "high" | "medium" | "low";
      category: string;
      reason: string;
      benefits: string[];
      timing: string;
    }[];
    
    Return ONLY the JSON array with no additional text or explanation.
  `;

  try {
    const response = await callGeminiAPI(prompt);
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", response);
      toast.error("Received invalid response format from AI. Using fallback recommendations.");
      // Return fallback recommendations
      return getFallbackRecommendations();
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return getFallbackRecommendations();
  }
};

const getFallbackRecommendations = (): Recommendation[] => {
  return [
    {
      id: 1,
      name: "Vitamin D3",
      dosage: "2000 IU daily",
      priority: "high",
      category: "Basic Essentials",
      reason: "Based on your energy concerns and lifestyle, vitamin D deficiency is likely contributing to fatigue and mood issues.",
      benefits: ["Energy support", "Immune function", "Mood regulation"],
      timing: "Take with breakfast for better absorption"
    },
    {
      id: 2,
      name: "Magnesium Glycinate",
      dosage: "400mg before bed",
      priority: "high",
      category: "Basic Essentials",
      reason: "Your stress levels and sleep quality indicate magnesium deficiency, which affects both relaxation and energy production.",
      benefits: ["Better sleep", "Stress reduction", "Muscle relaxation"],
      timing: "Take 30 minutes before bedtime"
    },
    {
      id: 3,
      name: "Omega-3 EPA/DHA",
      dosage: "1000mg daily",
      priority: "medium",
      category: "Basic Essentials",
      reason: "Essential for brain health, inflammation reduction, and cardiovascular support based on your health goals.",
      benefits: ["Brain function", "Heart health", "Anti-inflammatory"],
      timing: "Take with meals to reduce fishy aftertaste"
    },
    {
      id: 4,
      name: "B-Complex",
      dosage: "1 capsule daily",
      priority: "medium",
      category: "Advanced Support",
      reason: "Your afternoon energy crashes suggest B-vitamin deficiencies, particularly B12 and folate.",
      benefits: ["Energy metabolism", "Nervous system support", "Mental clarity"],
      timing: "Take with breakfast for sustained energy"
    },
    {
      id: 5,
      name: "Probiotic Complex",
      dosage: "10 billion CFU daily",
      priority: "medium",
      category: "Advanced Support",
      reason: "Your digestive symptoms indicate gut microbiome imbalance affecting nutrient absorption and immunity.",
      benefits: ["Digestive health", "Immune support", "Nutrient absorption"],
      timing: "Take on empty stomach, 30 minutes before breakfast"
    }
  ];
};
