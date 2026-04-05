import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, CalendarDays } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { GoalTracker } from './GoalTracker';
import { CoinJar } from './CoinJar';
import { SpendingHeatmap } from './SpendingHeatmap';
import './DashboardOverview.css';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip glass-panel">
        <p className="label">{label}</p>
        <p className="value">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export function DashboardOverview() {
  const { getStats, getBalanceTrend, getCategorySpending, monthlyBudget, getMonthlyStats, getMonthlyCategorySpending } = useFinanceStore();
  const { income, expenses, balance } = getStats();
  const { monthlyExpense } = getMonthlyStats();
  const budgetProgress = Math.min(100, Math.max(0, (monthlyExpense / monthlyBudget) * 100));
  const trendData = getBalanceTrend();
  const spendingData = getCategorySpending();
  const monthlyCategoryData = getMonthlyCategorySpending();

  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500} className="tilt-wrapper">
          <div className="stat-card glass-panel">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                <Wallet size={24} color="#6366f1" />
              </div>
              <span className="stat-title">Total Balance</span>
            </div>
            <div className="stat-value">${balance.toLocaleString()}</div>
          </div>
        </Tilt>
        
        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500} className="tilt-wrapper">
          <div className="stat-card glass-panel">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                <TrendingUp size={24} color="#10b981" />
              </div>
              <span className="stat-title">Total Income</span>
            </div>
            <div className="stat-value text-success">${income.toLocaleString()}</div>
          </div>
        </Tilt>
        
        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500} className="tilt-wrapper">
          <div className="stat-card glass-panel">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
                <TrendingDown size={24} color="#ef4444" />
              </div>
              <span className="stat-title">Total Expenses</span>
            </div>
            <div className="stat-value text-danger">-${expenses.toLocaleString()}</div>
          </div>
        </Tilt>

        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500} className="tilt-wrapper">
          <div className="stat-card glass-panel">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
                <CalendarDays size={24} color="#f59e0b" />
              </div>
              <span className="stat-title">Monthly Expenses</span>
            </div>
            <div className="stat-value text-warning">-${monthlyExpense.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
            <div className="budget-tracker">
              <div className="budget-labels" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Budget Limit</span>
                <span>${monthlyBudget}</span>
              </div>
              <div className="progress-bar-bg" style={{ height: '6px' }}>
                <div className="progress-bar-fill" style={{ width: `${budgetProgress}%`, backgroundColor: budgetProgress > 90 ? 'var(--danger)' : '#f59e0b' }}></div>
              </div>
            </div>
          </div>
        </Tilt>
      </div>

      <div className="gamification-grid">
         <GoalTracker />
         <div className="glass-panel" style={{padding: '24px'}}>
            <SpendingHeatmap />
         </div>
      </div>

      <div className="charts-grid">
        <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} transitionSpeed={2500} className="tilt-wrapper">
          <div className="chart-card glass-panel h-100">
            <h3>Balance Trend</h3>
            <div className="chart-container">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
              ) : (
                <div className="empty-chart">No trend data available</div>
              )}
            </div>
          </div>
        </Tilt>

        <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} transitionSpeed={2500} className="tilt-wrapper">
          <div className="chart-card glass-panel h-100">
            <h3>Jar of Expenses</h3>
            <div className="chart-container">
              <CoinJar />
              {spendingData.length > 0 && (
                <div className="custom-legend jar-legend">
                  {spendingData.slice(0, 4).map((entry, index) => (
                    <div key={entry.name} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="legend-name">{entry.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Tilt>

        <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} transitionSpeed={2500} className="tilt-wrapper">
          <div className="chart-card glass-panel h-100">
            <h3>This Month by Category</h3>
            <div className="chart-container">
              {monthlyCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={monthlyCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-chart">No expenses for this month.</div>
              )}

              {monthlyCategoryData.length > 0 && (
                <div className="custom-legend jar-legend">
                  {monthlyCategoryData.slice(0, 6).map((entry, index) => (
                    <div key={entry.name} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="legend-name">{entry.name} — ${entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Tilt>
      </div>
    </div>
  );
}
