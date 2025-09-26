import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Activity, Stethoscope, User, Zap } from 'lucide-react';
import { FormField } from './FormField';
import { FeatureGuide } from './FeatureGuide';

export interface HeartDiseaseFormData {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

interface HeartDiseasePredictorProps {
  onPredict?: (data: HeartDiseaseFormData) => void;
  isLoading?: boolean;
}

export const HeartDiseasePredictor: React.FC<HeartDiseasePredictorProps> = ({
  onPredict,
  isLoading = false
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<HeartDiseaseFormData>({
    defaultValues: {
      age: 57,
      sex: 1,
      cp: 3,
      trestbps: 150,
      chol: 276,
      fbs: 1,
      restecg: 2,
      thalach: 112,
      exang: 1,
      oldpeak: 0.6,
      slope: 1,
      ca: 1,
      thal: 1
    }
  });

  const onSubmit = (data: HeartDiseaseFormData) => {
    onPredict?.(data);
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-heart shadow-medical">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">Heart Disease Predictor</h1>
          <p className="text-lg text-muted-foreground">
            Advanced cardiac risk assessment using machine learning
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Stethoscope className="h-6 w-6 text-primary" />
                  Assessment
                </CardTitle>
                <CardDescription>
                  Enter patient info for risk estimate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Demographics Section */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <User className="h-5 w-5 text-primary" />
                      Demographics
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        label="Age (years)"
                        error={errors.age?.message}
                      >
                        <Input
                          type="number"
                          {...register('age', {
                            required: 'Age is required',
                            min: { value: 18, message: 'Min 18' },
                            max: { value: 100, message: 'Max 100' },
                          })}
                          className={
                            'bg-background ' +
                            ((() => { const v = watch('age'); return (v < 18 || v > 100) ? 'border-destructive/70 ring-1 ring-destructive/40' : ''; })())
                          }
                        />
                      </FormField>

                      <FormField
                        label="Sex"
                        error={errors.sex?.message}
                      >
                        <Select onValueChange={(value) => setValue('sex', parseInt(value))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Female</SelectItem>
                            <SelectItem value="1">Male</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>
                  </div>

                  {/* Symptoms Section */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Activity className="h-5 w-5 text-primary" />
                      Symptoms
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        label="Chest Pain Type"
                        error={errors.cp?.message}
                      >
                        <Select onValueChange={(value) => setValue('cp', parseInt(value))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select chest pain type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Typical Angina</SelectItem>
                            <SelectItem value="1">Atypical Angina</SelectItem>
                            <SelectItem value="2">Non-anginal Pain</SelectItem>
                            <SelectItem value="3">Asymptomatic</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>

                      <FormField
                        label="Exercise-Induced Angina"
                        error={errors.exang?.message}
                      >
                        <Select onValueChange={(value) => setValue('exang', parseInt(value))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No</SelectItem>
                            <SelectItem value="1">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>
                  </div>

                  {/* Vital Signs Section */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Zap className="h-5 w-5 text-primary" />
                      Vitals & Labs
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <FormField
                        label="Resting Blood Pressure (mmHg)"
                        error={errors.trestbps?.message}
                      >
                        <Input
                          type="number"
                          {...register('trestbps', {
                            required: 'Blood pressure is required',
                            min: { value: 80, message: 'Min 80' },
                            max: { value: 200, message: 'Max 200' },
                          })}
                          className={
                            'bg-background ' +
                            ((() => { const v = watch('trestbps'); return (v < 80 || v > 200) ? 'border-destructive/70 ring-1 ring-destructive/40' : ''; })())
                          }
                        />
                      </FormField>

                      <FormField
                        label="Serum Cholesterol (mg/dL)"
                        error={errors.chol?.message}
                      >
                        <Input
                          type="number"
                          {...register('chol', {
                            required: 'Cholesterol is required',
                            min: { value: 100, message: 'Min 100' },
                            max: { value: 500, message: 'Max 500' },
                          })}
                          className={
                            'bg-background ' +
                            ((() => { const v = watch('chol'); return (v < 100 || v > 500) ? 'border-destructive/70 ring-1 ring-destructive/40' : ''; })())
                          }
                        />
                      </FormField>

                      <FormField
                        label="Fasting Blood Sugar (>120 mg/dL)"
                        error={errors.fbs?.message}
                      >
                        <Select onValueChange={(value) => setValue('fbs', parseInt(value))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">False</SelectItem>
                            <SelectItem value="1">True</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>

                      <FormField
                        label="Max Heart Rate (bpm)"
                        error={errors.thalach?.message}
                      >
                        <Input
                          type="number"
                          {...register('thalach', {
                            required: 'Max heart rate is required',
                            min: { value: 60, message: 'Min 60' },
                            max: { value: 250, message: 'Max 250' },
                          })}
                          className={
                            'bg-background ' +
                            ((() => { const v = watch('thalach'); return (v < 60 || v > 250) ? 'border-destructive/70 ring-1 ring-destructive/40' : ''; })())
                          }
                        />
                      </FormField>

                      <FormField
                        label="ST Depression"
                        error={errors.oldpeak?.message}
                      >
                        <Input
                          type="number"
                          step="0.1"
                          {...register('oldpeak', {
                            required: 'Oldpeak is required',
                            min: { value: 0, message: 'Min 0' },
                            max: { value: 6, message: 'Max 6' },
                          })}
                          className={
                            'bg-background ' +
                            ((() => { const v = watch('oldpeak'); return (v < 0 || v > 6) ? 'border-destructive/70 ring-1 ring-destructive/40' : ''; })())
                          }
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Diagnostic Tests Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Diagnostic Tests</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <FormField
                        label="Resting ECG"
                        error={errors.restecg?.message}
                      >
                        <Select onValueChange={(value) => setValue('restecg', parseInt(value))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select ECG result" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Normal</SelectItem>
                            <SelectItem value="1">ST-T Abnormality</SelectItem>
                            <SelectItem value="2">LVH (Estes)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>

                      <FormField
                        label="ST Slope"
                        error={errors.slope?.message}
                      >
                        <Select onValueChange={(value) => setValue('slope', parseInt(value))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select slope" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Upsloping</SelectItem>
                            <SelectItem value="1">Flat</SelectItem>
                            <SelectItem value="2">Downsloping</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>

                      <FormField
                        label="Major Vessels (0–3)"
                        error={errors.ca?.message}
                      >
                        <Select onValueChange={(value) => setValue('ca', parseInt(value))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select count" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>

                      <FormField
                        label="Thalassemia"
                        error={errors.thal?.message}
                      >
                        <Select onValueChange={(value) => setValue('thal', parseInt(value))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select thalassemia type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Normal</SelectItem>
                            <SelectItem value="1">Fixed Defect</SelectItem>
                            <SelectItem value="2">Reversible Defect</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      variant="medical"
                      size="lg"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Heart className="h-5 w-5" />
                          Predict Risk
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Feature Guide Sidebar */}
          <div className="lg:col-span-1">
            <FeatureGuide />
          </div>
        </div>
      </div>
    </div>
  );
};