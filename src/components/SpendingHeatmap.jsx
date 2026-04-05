import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { differenceInDays, subDays, parseISO, format } from 'date-fns';
import './SpendingHeatmap.css';

export function SpendingHeatmap() {
  const { transactions } = useFinanceStore();

  // Create a 30-day window
  const today = new Date();
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = subDays(today, 29 - i);
    return {
      date: format(d, 'yyyy-MM-dd'),
      spending: 0
    };
  });

  // Populate sending data
  transactions.forEach(t => {
    if (t.type === 'expense') {
      const match = days.find(d => d.date === t.date);
      if (match) {
        match.spending += Number(t.amount);
      }
    }
  });

  // Calculate intensity 0-4
  const maxSpending = Math.max(...days.map(d => d.spending), 1);
  
  const getIntensity = (val) => {
    if (val === 0) return 0; // No spending (good/green usually, but let's say empty is good, but for github style green is good, wait here red is heavy spending)
    const ratio = val / maxSpending;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  return (
    <div className="heatmap-container">
      <h4>30-Day Spending Intensity</h4>
      <div className="heatmap-grid">
        {days.map((day, i) => (
          <div 
            key={day.date} 
            className={`diff-box intensity-${getIntensity(day.spending)}`}
            title={`${day.date}: $${day.spending.toFixed(2)}`}
          ></div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span className="text-secondary" style={{fontSize: '0.75rem'}}>Light</span>
        <div className="diff-box intensity-0"></div>
        <div className="diff-box intensity-1"></div>
        <div className="diff-box intensity-2"></div>
        <div className="diff-box intensity-3"></div>
        <div className="diff-box intensity-4"></div>
        <span className="text-secondary" style={{fontSize: '0.75rem'}}>Heavy</span>
      </div>
    </div>
  );
}
