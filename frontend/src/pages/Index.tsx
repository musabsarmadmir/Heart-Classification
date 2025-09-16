import React, { useState } from 'react';
import { HeartDiseasePredictor, HeartDiseaseFormData } from '@/components/HeartDiseasePredictor';
import { useToast } from '@/hooks/use-toast';
import { predictHeartDisease } from '@/lib/api';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

      toast({
        title: "Prediction Complete",
  description: `Label: ${response.label} | Probability: ${(response.probability * 100).toFixed(1)}%`,
        variant: "default",
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Error",
        description: "Unable to process prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HeartDiseasePredictor 
      onPredict={handlePredict}
      isLoading={isLoading}
    />
  );
};

export default Index;
