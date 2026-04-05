import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Lightbulb, Trophy, AlertTriangle } from 'lucide-react';
import './InsightsPanel.css';

export function InsightsPanel() {
  const { transactions, getStats, getCategorySpending } = useFinanceStore();
  const { income, expenses } = getStats();
  const spendingData = getCategorySpending();

  const savingsRate = income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : 0;
  
  const highestCategory = spendingData.length > 0 ? spendingData[0] : null;

  const currentMonthTransactions = transactions.filter(t => {
    const today = new Date();
    const tDate = new Date(t.date);
    return tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear();
  });

  const thisMonthExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  return (
    <div className="insights-container">
      <div className="insights-grid">
        <div className="insight-card glass-panel">
          <div className="insight-header">
            <Trophy size={24} className="text-success" />
            <h3>Savings Rate</h3>
          </div>
          <div className="insight-content">
            <div className="insight-value">{savingsRate}%</div>
            <p className="text-secondary">Of your total income is being saved.</p>
            {savingsRate > 20 ? (
              <div className="insight-badge success">Great job! You're above the 20% rule.</div>
            ) : (
              <div className="insight-badge warning">Try to aim for at least 20% savings.</div>
            )}
          </div>
        </div>

        <div className="insight-card glass-panel">
          <div className="insight-header">
            <AlertTriangle size={24} className="text-warning" />
            <h3>Top Spending</h3>
          </div>
          <div className="insight-content">
            {highestCategory ? (
              <>
                <div className="insight-value highlight">{highestCategory.name}</div>
                <p className="text-secondary">is your highest expense category at <strong style={{color: 'var(--text-primary)'}}>${highestCategory.value.toLocaleString()}</strong>.</p>
                <div className="insight-badge dark">Consider reviewing this category.</div>
              </>
            ) : (
              <p className="text-secondary">No spending data available to analyze.</p>
            )}
          </div>
        </div>

        <div className="insight-card glass-panel">
          <div className="insight-header">
            <Lightbulb size={24} className="text-accent" />
            <h3>Monthly Overview</h3>
          </div>
          <div className="insight-content">
            <div className="insight-value">${thisMonthExpenses.toLocaleString()}</div>
            <p className="text-secondary">spent so far this month.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
