'use client';

import { useState, useEffect } from 'react';
import { setAnalyticsOptOut } from '@/lib/analytics';
import { Button } from '@/components/ui/button';

interface AnalyticsOptOutProps {
  labels: {
    title: string;
    description: string;
    enabled: string;
    disabled: string;
    save: string;
  };
}

/**
 * Component for users to opt out of Google Analytics tracking
 */
export function AnalyticsOptOut({ labels }: AnalyticsOptOutProps) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize state from localStorage after mount
  useEffect(() => {
    setIsMounted(true);
    const optOut = localStorage.getItem('ga-opt-out') === 'true';
    setAnalyticsEnabled(!optOut);
  }, []);
  
  // Handle toggle change
  const handleToggle = () => {
    const newValue = !analyticsEnabled;
    setAnalyticsEnabled(newValue);
    
    // Update analytics preference
    setAnalyticsOptOut(!newValue);
  };
  
  // Don't render anything during SSR
  if (!isMounted) return null;
  
  return (
    <div className="p-4 border rounded-lg bg-muted/50">
      <h3 className="text-lg font-semibold mb-2">{labels.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{labels.description}</p>
      
      <div className="flex items-center justify-between">
        <span>
          {analyticsEnabled ? labels.enabled : labels.disabled}
        </span>
        <Button 
          variant={analyticsEnabled ? "default" : "outline"}
          onClick={handleToggle}
        >
          {analyticsEnabled ? labels.enabled : labels.disabled}
        </Button>
      </div>
    </div>
  );
}