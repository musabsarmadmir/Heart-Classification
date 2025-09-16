import React, { useState } from 'react';
import { HeartDiseasePredictor, HeartDiseaseFormData } from '@/components/HeartDiseasePredictor';
import { predictHeartDisease, type PredictResponse } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);

  const handlePredict = async (data: HeartDiseaseFormData) => {
    setIsLoading(true);
    
    try {
      const payload = {
        features: {
          age: Number(data.age),
          sex: Number(data.sex),
          cp: Number(data.cp),
          trestbps: Number(data.trestbps),
          chol: Number(data.chol),
          fbs: Number(data.fbs),
          restecg: Number(data.restecg),
          thalach: Number(data.thalach),
          exang: Number(data.exang),
          oldpeak: Number(data.oldpeak),
          slope: Number(data.slope),
          ca: Number(data.ca),
          thal: Number(data.thal),
        }
      };

      const response = await predictHeartDisease(payload);
      setResult(response);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <HeartDiseasePredictor 
        onPredict={handlePredict}
        isLoading={isLoading}
      />

      {result && (
        <ResultPanel result={result} />
      )}
    </div>
  );
};

export default Index;

type ResultPanelProps = {
  result: PredictResponse;
};

const ResultPanel: React.FC<ResultPanelProps> = ({ result }) => {
  const probPatientRaw = typeof result.probability === 'number' ? result.probability : 0;
  const probPatient = Math.max(0, Math.min(1, probPatientRaw));
  const probHealthy = 1 - probPatient;
  const healthyPct = +(probHealthy * 100).toFixed(1);
  const patientPct = +(probPatient * 100).toFixed(1);
  const isPatient = result.label === 1;
  const labelText = isPatient ? 'Heart Patient' : 'Healthy';

  return (
    <Card className={isPatient ? 'border-red-200 bg-red-50/40' : 'border-green-200 bg-green-50/40'}>
      <CardHeader className="pb-2 items-center text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Heart className={isPatient ? 'h-6 w-6 text-red-600' : 'h-6 w-6 text-green-600'} />
          <span className={isPatient ? 'text-red-700' : 'text-green-700'}>Result: {labelText}</span>
        </CardTitle>
        <CardDescription>
          This tool provides educational insights and does not constitute medical advice.
          Please consult a qualified healthcare professional for diagnosis or treatment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-6 py-2">
          <div className="flex items-end justify-center gap-10">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Healthy Probability</div>
              <div className="text-4xl font-semibold text-green-700">{healthyPct}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Heart Patient Probability</div>
              <div className="text-4xl font-semibold text-red-700">{patientPct}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
