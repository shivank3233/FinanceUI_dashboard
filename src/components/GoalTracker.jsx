import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Target, Flame } from 'lucide-react';
import './GoalTracker.css';

export function GoalTracker() {
  const { goal, getGamificationStats } = useFinanceStore();
  const { savingStreak, goalProgress, achievements } = getGamificationStats();

  return (
    <div className="goal-tracker-container glass-panel">
      <div className="goal-header">
        <Target className="text-accent" size={24} />
        <h3>{goal ? `Current Objective: ${goal.title}` : 'No Current Objective'}</h3>
      </div>
      
      {goal ? (
        <div className="progress-section">
          <div className="progress-labels">
            <span className="text-secondary">Progress</span>
            <span className="font-bold">{goalProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill slide-in" style={{ width: `${goalProgress}%` }}></div>
          </div>
        </div>
      ) : (
        <div className="no-goal-placeholder text-secondary">Set a savings goal to track progress.</div>
      )}

      <div className="gamification-stats">
        <div className="streak-indicator">
          <Flame className={savingStreak > 0 ? "streak-fire active" : "streak-fire"} size={20} />
          <span>{savingStreak} Day Streak</span>
        </div>

        <div className="achievements-list">
          {achievements.map((ach, idx) => (
            <span key={idx} className="achievement-badge">{ach}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
