import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Heart, Activity, Zap, User } from 'lucide-react';

export const FeatureGuide: React.FC = () => {
  const features = [
    {
      category: "Demographics",
      icon: User,
      color: "bg-blue-500",
      items: [
        {
          name: "Age (age)",
          description: "Age in years"
        },
        {
          name: "Sex (sex)",
          description: "Biological sex encoded as 0 or 1 — 0: female, 1: male"
        }
      ]
    },
    {
      category: "Symptoms",
      icon: Activity,
      color: "bg-green-500", 
      items: [
        {
          name: "Chest Pain Type (cp)",
          description: "Chest pain category (encoded 0-3) — 0: Typical, 1: Atypical, 2: Non-anginal, 3: Asymptomatic"
        },
        {
          name: "Exercise Induced Angina (exang)",
          description: "Exercise-induced angina (encoded) — 0: no, 1: yes"
        }
      ]
    },
    {
      category: "Vital Signs",
      icon: Heart,
      color: "bg-red-500",
      items: [
        {
          name: "Resting Blood Pressure (trestbps)",
          description: "Resting blood pressure in mm Hg"
        },
        {
          name: "Serum Cholesterol (chol)",
          description: "Serum cholesterol in mg/dl"
        },
        {
          name: "Fasting Blood Sugar (fbs)",
          description: "Whether fasting blood sugar > 120 mg/dl (encoded) — 0: false, 1: true"
        },
        {
          name: "Max Heart Rate (thalach)",
          description: "Maximum heart rate achieved (bpm)"
        }
      ]
    },
    {
      category: "Diagnostic Tests",
      icon: Zap,
      color: "bg-purple-500",
      items: [
        {
          name: "Resting ECG (restecg)",
          description: "Resting electrocardiographic results (encoded 0-2) — 0: Normal, 1: ST-T abnormality, 2: LVH (Estes)"
        },
        {
          name: "ST Depression (oldpeak)",
          description: "ST depression induced by exercise relative to rest"
        },
        {
          name: "ST Slope (slope)",
          description: "Slope of the peak exercise ST segment (encoded 0-2) — 0: Upsloping, 1: Flat, 2: Downsloping"
        },
        {
          name: "Major Vessels (ca)",
          description: "Number of major vessels (0-3) colored by fluoroscopy"
        },
        {
          name: "Thalassemia (thal)",
          description: "Thalassemia (encoded 0–2) — 0: Normal, 1: Fixed defect, 2: Reversible defect"
        }
      ]
    }
  ];

  return (
    <Card className="sticky top-6 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="h-5 w-5 text-primary" />
          Medical Parameters Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {features.map((category) => (
          <div key={category.category} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`rounded-full p-1.5 ${category.color}`}>
                <category.icon className="h-3 w-3 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">{category.category}</h3>
            </div>
            <div className="space-y-3 ml-6">
              {category.items.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="font-medium text-sm text-foreground">{item.name}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 rounded-lg bg-muted">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Clinical Note</p>
              All parameters are standardized for machine learning analysis. Values should reflect actual clinical measurements for accurate prediction.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};