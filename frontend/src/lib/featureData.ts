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
  { name: "Age", description: "Patient age in years." },
  { name: "Sex", description: "Biological sex (0 = female, 1 = male)." },
    ],
  },
  {
    category: "Symptoms",
    icon: Activity,
    colorClass: "bg-green-500",
    items: [
  { name: "Chest Pain Type", description: "Type of chest pain (0–3)." },
  { name: "Exercise-Induced Angina", description: "Angina triggered by exercise (0 = no, 1 = yes)." },
    ],
  },
  {
    category: "Vital Signs",
    icon: Heart,
    colorClass: "bg-red-500",
    items: [
  { name: "Resting Blood Pressure", description: "Blood pressure at rest (mmHg)." },
  { name: "Serum Cholesterol", description: "Cholesterol level (mg/dL)." },
  { name: "Fasting Blood Sugar", description: "Fasting blood sugar > 120 mg/dL (0 = no, 1 = yes)." },
  { name: "Max Heart Rate", description: "Highest heart rate reached (bpm)." },
    ],
  },
  {
    category: "Diagnostic Tests",
    icon: Zap,
    colorClass: "bg-purple-500",
    items: [
  { name: "Resting ECG", description: "ECG result at rest (0–2)." },
  { name: "ST Depression", description: "ST depression during exercise vs rest." },
  { name: "ST Slope", description: "Slope of the peak exercise ST segment (0–2)." },
  { name: "Major Vessels", description: "Count of major vessels seen (0–3)." },
  { name: "Thalassemia", description: "Thalassemia status (0–2)." },
    ],
  },
];
