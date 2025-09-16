import type { ComponentType, SVGProps } from "react";

export type FeatureItem = {
  name: string;
  description: string;
};

export type FeatureCategory = {
  category: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  colorClass: string;
  items: FeatureItem[];
};

import { User, Activity, Heart, Zap } from "lucide-react";

export const featureCategories: FeatureCategory[] = [
  {
    category: "Demographics",
    icon: User,
    colorClass: "bg-blue-500",
    items: [
      { name: "Age (age)", description: "Age in years" },
      { name: "Sex (sex)", description: "Biological sex encoded as 0 or 1 — 0: female, 1: male" },
    ],
  },
  {
    category: "Symptoms",
    icon: Activity,
    colorClass: "bg-green-500",
    items: [
      { name: "Chest Pain Type (cp)", description: "Chest pain category (encoded 0-3) — 0: Typical, 1: Atypical, 2: Non-anginal, 3: Asymptomatic" },
      { name: "Exercise Induced Angina (exang)", description: "Exercise-induced angina (encoded) — 0: no, 1: yes" },
    ],
  },
  {
    category: "Vital Signs",
    icon: Heart,
    colorClass: "bg-red-500",
    items: [
      { name: "Resting Blood Pressure (trestbps)", description: "Resting blood pressure in mm Hg" },
      { name: "Serum Cholesterol (chol)", description: "Serum cholesterol in mg/dl" },
      { name: "Fasting Blood Sugar (fbs)", description: "Whether fasting blood sugar > 120 mg/dl (encoded) — 0: false, 1: true" },
      { name: "Max Heart Rate (thalach)", description: "Maximum heart rate achieved (bpm)" },
    ],
  },
  {
    category: "Diagnostic Tests",
    icon: Zap,
    colorClass: "bg-purple-500",
    items: [
      { name: "Resting ECG (restecg)", description: "Resting electrocardiographic results (encoded 0-2) — 0: Normal, 1: ST-T abnormality, 2: LVH (Estes)" },
      { name: "ST Depression (oldpeak)", description: "ST depression induced by exercise relative to rest" },
      { name: "ST Slope (slope)", description: "Slope of the peak exercise ST segment (encoded 0-2) — 0: Upsloping, 1: Flat, 2: Downsloping" },
      { name: "Major Vessels (ca)", description: "Number of major vessels (0-3) colored by fluoroscopy" },
      { name: "Thalassemia (thal)", description: "Thalassemia (encoded 0–2) — 0: Normal, 1: Fixed defect, 2: Reversible defect" },
    ],
  },
];
