'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function HelloWorldCard() {
  const [message, setMessage] = useState<string>('Loading...');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/demo/hello');
      const data = await res.json();
      setMessage(data.message || 'Hello World');
    } catch (err) {
      setMessage('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>DevPilot Demo Greeting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg text-center font-medium">
          {message}
        </div>
        <Button 
          onClick={fetchMessage} 
          disabled={loading} 
          className="w-full"
        >
          {loading ? 'Refreshing...' : 'Refresh Greeting'}
        </Button>
      </CardContent>
    </Card>
  );
}