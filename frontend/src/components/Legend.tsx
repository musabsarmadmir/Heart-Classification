import { featureMeta, featureOrder } from '../types/features'
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'

export default function Legend() {
  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>Feature Legend</Typography>
      <List dense>
        {featureOrder.map((name) => {
          const meta = featureMeta[name]
          return (
            <ListItem key={name} sx={{ py: 0 }}>
              <ListItemText
                primary={`${meta.label} (${name})`}
                secondary={meta.hint ? `${meta.description} — ${meta.hint}` : meta.description}
              />
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
