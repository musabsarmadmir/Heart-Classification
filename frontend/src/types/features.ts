export const featureOrder = [
  'age','sex','cp','trestbps','chol','fbs','restecg','thalach','exang','oldpeak','slope','ca','thal'
] as const

export type FeatureName = typeof featureOrder[number]

export type FeatureMeta = {
  label: string
  description: string
  hint?: string
}

export const featureMeta: Record<FeatureName, FeatureMeta> = {
  age: {
    label: 'Age',
    description: 'Age in years.'
  },
  sex: {
    label: 'Sex',
    description: 'Biological sex encoded as 0 or 1.',
    hint: '0 = female, 1 = male'
  },
  cp: {
    label: 'Chest Pain Type (cp)',
    description: 'Chest pain category (encoded 0–3).',
    hint: '0: Typical, 1: Atypical, 2: Non-anginal, 3: Asymptomatic'
  },
  trestbps: {
    label: 'Resting Blood Pressure (trestbps)',
    description: 'Resting blood pressure in mm Hg.'
  },
  chol: {
    label: 'Serum Cholesterol (chol)',
    description: 'Serum cholesterol in mg/dl.'
  },
  fbs: {
    label: 'Fasting Blood Sugar (fbs)',
    description: 'Whether fasting blood sugar > 120 mg/dl (encoded).',
    hint: '0 = false, 1 = true'
  },
  restecg: {
    label: 'Resting ECG (restecg)',
    description: 'Resting electrocardiographic results (encoded 0–2).',
    hint: '0: Normal, 1: ST-T abnormality, 2: LVH (Estes)'
  },
  thalach: {
    label: 'Max Heart Rate (thalach)',
    description: 'Maximum heart rate achieved (bpm).'
  },
  exang: {
    label: 'Exercise Induced Angina (exang)',
    description: 'Exercise-induced angina (encoded).',
    hint: '0 = no, 1 = yes'
  },
  oldpeak: {
    label: 'ST Depression (oldpeak)',
    description: 'ST depression induced by exercise relative to rest.'
  },
  slope: {
    label: 'ST Slope (slope)',
    description: 'Slope of the peak exercise ST segment (encoded 0–2).',
    hint: '0: Upsloping, 1: Flat, 2: Downsloping'
  },
  ca: {
    label: 'Major Vessels (ca)',
    description: 'Number of major vessels (0–3) colored by fluoroscopy.'
  },
  thal: {
    label: 'Thalassemia (thal)',
    description: 'Thalassemia status (dataset-encoded categorical).',
    hint: 'Common encodings vary by dataset; use model’s mapping.'
  }
}
