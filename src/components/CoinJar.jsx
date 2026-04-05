import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import './CoinJar.css';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function CoinJar() {
  const { getCategorySpending } = useFinanceStore();
  const spendingData = getCategorySpending();
  const totalSpent = spendingData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="coin-jar-container">
      <div className="jar-glass">
        <div className="jar-lid"></div>
        <div className="jar-body">
          {spendingData.length === 0 && (
            <div className="empty-jar-text">Jar is empty!</div>
          )}
          <div className="liquid-container">
            {spendingData.map((cat, idx) => {
              const percentage = totalSpent > 0 ? (cat.value / totalSpent) * 100 : 0;
              return (
                <div 
                  key={cat.name}
                  className="liquid-layer"
                  style={{ 
                    height: `${percentage}%`,
                    backgroundColor: COLORS[idx % COLORS.length]
                  }}
                  title={`${cat.name}: $${cat.value}`}
                >
                  <span className="layer-label">{percentage > 10 ? cat.name : ''}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
