import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { featureCategories } from '@/lib/featureData';
import { Label } from '@/components/ui/label';

export const FeatureGuide: React.FC = () => {
  const [showDescriptions, setShowDescriptions] = React.useState<boolean>(true);
  const [openItem, setOpenItem] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('featureGuide.showDescriptions');
      if (stored !== null) setShowDescriptions(stored === '1');
      const lastOpen = localStorage.getItem('featureGuide.openItem');
      if (lastOpen) setOpenItem(lastOpen || undefined);
    } catch {
      void 0;
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem('featureGuide.showDescriptions', showDescriptions ? '1' : '0');
    } catch {
      void 0;
    }
  }, [showDescriptions]);

  React.useEffect(() => {
    try {
      localStorage.setItem('featureGuide.openItem', openItem ?? '');
    } catch {
      void 0;
    }
  }, [openItem]);

  return (
    <Card className="sticky top-6 shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-primary" />
            Medical Parameters Guide
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="featureGuide-showdesc" className="text-xs text-muted-foreground">Show descriptions</Label>
            <Switch id="featureGuide-showdesc" aria-label="Show descriptions" checked={showDescriptions} onCheckedChange={(v) => setShowDescriptions(!!v)} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible value={openItem} onValueChange={(v) => setOpenItem(v || undefined)}>
          {featureCategories.map((category) => (
            <AccordionItem key={category.category} value={category.category}>
              <AccordionTrigger className="px-0 py-3 gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md">
                <div className="flex items-center gap-2">
                  <div className={`rounded-full p-1.5 ${category.colorClass}`}>
                    <category.icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-semibold text-foreground text-left">{category.category}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-6">
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="font-medium text-sm text-foreground">{item.name}</div>
                      {showDescriptions && (
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {showDescriptions && (
        <div className="mt-6 p-4 rounded-lg bg-muted">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Clinical Note</p>
              All parameters are standardized for machine learning analysis. Values should reflect actual clinical measurements for accurate prediction.
            </div>
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
};