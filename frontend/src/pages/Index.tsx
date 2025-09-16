import React, { useEffect, useMemo, useState } from 'react';
import { HeartDiseasePredictor, HeartDiseaseFormData } from '@/components/HeartDiseasePredictor';
import { predictHeartDisease, type PredictResponse } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type HistoryEntry = {
  at: number; // epoch ms
  result: PredictResponse;
};

const HISTORY_KEY = 'predict.history.v1';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HistoryEntry[];
        if (Array.isArray(parsed)) setHistory(parsed.slice(0, 3));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 3)));
    } catch {
      // ignore
    }
  }, [history]);

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
      setHistory((prev) => [{ at: Date.now(), result: response }, ...prev].slice(0, 3));
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

      {/* Previous Results */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl">Previous Results</CardTitle>
              <CardDescription>Latest three predictions on this device</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setHistory([])} disabled={history.length === 0}>Clear</Button>
              <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="secondary" size="sm">{historyOpen ? 'Hide' : 'Show'}</Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pt-4">
                    {history.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No recent results</div>
                    ) : (
                      <ul className="space-y-3">
                        {history.map((h, idx) => {
                          const isPatient = h.result.label === 1;
                          const prob = Math.round((isPatient ? h.result.probability : 1 - h.result.probability) * 100);
                          const when = new Date(h.at);
                          const time = when.toLocaleString();
                          return (
                            <li key={h.at + ':' + idx} className="flex items-center justify-between gap-3 rounded-md border p-3">
                              <div className="flex items-center gap-3">
                                <Badge variant={isPatient ? 'destructive' : 'secondary'}>{isPatient ? 'Patient' : 'Healthy'}</Badge>
                                <span className="text-sm text-muted-foreground">{time}</span>
                              </div>
                              <div className="text-sm font-semibold">Confidence: {prob}%</div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </CardHeader>
      </Card>
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
