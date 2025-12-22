'use client';

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

function useCountdown(targetDate: string) {
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
}

const getReturnValues = (countDown: number) => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  return [days, hours, minutes, seconds];
};

export default function Countdown() {
  const [days, hours, minutes, seconds] = useCountdown('2025-09-01T00:00:00');

  return (
    <Box display="flex" justifyContent="center" gap={4} py={2}>
      {[
        { label: 'DAYS', value: days },
        { label: 'HOURS', value: hours },
        { label: 'MINUTES', value: minutes },
        { label: 'SECONDS', value: seconds },
      ].map((item) => (
        <Box key={item.label} textAlign="center">
          <Typography variant="h4">
            {item.value.toString().padStart(2, '0')}
          </Typography>
          <Typography variant="caption">{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}
