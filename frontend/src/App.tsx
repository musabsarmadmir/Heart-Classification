import { useEffect, useMemo, useState } from 'react'
import { Container, CssBaseline, Typography, Paper, Grid, TextField, Button, Alert, Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { configInfo, predict } from './services/api'
import Legend from './components/Legend'
import { featureOrder, featureMeta } from './types/features'

const schema = z.object(
  Object.fromEntries(featureOrder.map(k => [k, z.coerce.number({ required_error: 'Required' })]))
)
type FormData = z.infer<typeof schema>

export default function App() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({ resolver: zodResolver(schema) })
  const [loading, setLoading] = useState(false)
  const [prob, setProb] = useState<number | null>(null)
  const [label, setLabel] = useState<number | null>(null)
  const [apiStatus, setApiStatus] = useState<string>('checking...')
  const [cfg, setCfg] = useState<any>(null)

  useEffect(() => {
    configInfo().then((c) => {
      setCfg(c)
      setApiStatus(c.model_ready ? 'ready' : 'model-not-loaded')
    }).catch(() => setApiStatus('unreachable'))
  }, [])

  const onSubmit = async (values: FormData) => {
    setLoading(true)
    setProb(null); setLabel(null)
    try {
      const res = await predict(values)
      setProb(res.probability)
      setLabel(res.label)
    } catch (e) {
      setProb(null); setLabel(null)
    } finally {
      setLoading(false)
    }
  }

  // Small sensible defaults for quick test
  useEffect(() => {
    const defaults: Partial<FormData> = { age: 57, sex: 1, cp: 3, trestbps: 150, chol: 276, fbs: 0, restecg: 2, thalach: 112, exang: 1, oldpeak: 0.6, slope: 1, ca: 1, thal: 1 }
    Object.entries(defaults).forEach(([k, v]) => setValue(k as keyof FormData, v as any))
  }, [setValue])

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Heart Disease Predictor</Typography>
        {apiStatus !== 'ready' && (
          <Alert severity={apiStatus === 'unreachable' ? 'error' : 'warning'} sx={{ mb: 2 }}>
            API status: {apiStatus}{cfg ? ` | model: ${cfg.model_path_exists ? 'found' : 'missing'}` : ''}
          </Alert>
        )}
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {featureOrder.map((name) => (
                <Grid item xs={12} sm={6} md={4} key={name}>
                  <TextField fullWidth label={`${featureMeta[name].label} (${name})`} type="number" size="small" placeholder={featureMeta[name].hint}
                    error={!!errors[name as keyof FormData]}
                    helperText={errors[name as keyof FormData]?.message as string | undefined}
                    {...register(name as keyof FormData)}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button variant="contained" type="submit" disabled={loading}>Predict</Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        {prob !== null && label !== null && (
          <Box mt={3}>
            <Alert severity={label === 1 ? 'warning' : 'success'}>
              Prediction: {label} | Probability: {(prob * 100).toFixed(1)}%
            </Alert>
          </Box>
        )}
        <Legend />
      </Container>
    </>
  )
}
