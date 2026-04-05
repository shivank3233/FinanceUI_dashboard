import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import './StoryWrap.css';

export function StoryWrap() {
  const { getStats, getCategorySpending } = useFinanceStore();
  const { income, expenses, balance } = getStats();
  const spendingData = getCategorySpending();

  // Generate Avatar logic
  let avatar = "🐢 The Slow Saver";
  let description = "You're taking it easy and saving moderately.";
  
  const savingsRate = income > 0 ? (income - expenses) / income : 0;
  
  if (savingsRate > 0.4) {
    avatar = "🧘 The Zen Master";
    description = "Unshakeable discipline. You're building incredible wealth.";
  } else if (savingsRate < 0.05 && expenses > 0) {
    avatar = "🦁 The Big Spender";
    description = "You lived large this month! Maybe too large?";
  } else if (income === 0 && expenses === 0) {
    avatar = "👻 The Ghost";
    description = "No activity. Are you there?";
  }

  const topCategory = spendingData.length > 0 ? spendingData[0].name : 'Nothing';

  return (
    <div className="story-container animate-fade-in">
      <div className="story-card glass-panel dark-aurora">
        <h2 className="story-title text-gradient">Your Financial Wrap</h2>
        
        <div className="story-slide">
          <h3>Your Financial Persona</h3>
          <div className="avatar-display">{avatar}</div>
          <p>{description}</p>
        </div>

        <div className="story-slide">
          <h3>The Big Picture</h3>
          <p>You brought in <span className="text-success font-bold">${income.toLocaleString()}</span> and spent <span className="text-danger font-bold">${expenses.toLocaleString()}</span>.</p>
          <p>That leaves you with a net balance of <span className="font-bold">${balance.toLocaleString()}</span>.</p>
        </div>

        <div className="story-slide">
          <h3>Your Weakness</h3>
          {topCategory !== 'Nothing' ? (
            <p>You spent the most on <span className="text-accent font-bold">{topCategory}</span>. Was it worth it? Probably!</p>
          ) : (
            <p>You didn't spend anything! Good job.</p>
          )}
        </div>
      </div>
    </div>
  );
}
