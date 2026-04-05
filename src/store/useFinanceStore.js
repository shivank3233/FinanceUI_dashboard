import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { differenceInDays, parseISO } from 'date-fns';

// Mock initial data
const initialTransactions = [
  { id: uuidv4(), date: '2026-03-31', amount: 5000, category: 'Salary', type: 'income', note: 'Monthly Salary' },
  { id: uuidv4(), date: '2026-04-01', amount: 150, category: 'Groceries', type: 'expense', note: 'Supermarket' },
  { id: uuidv4(), date: '2026-04-03', amount: 60, category: 'Transport', type: 'expense', note: 'Gas station' },
  { id: uuidv4(), date: '2026-04-04', amount: 200, category: 'Entertainment', type: 'expense', note: 'Concert tickets' },
  { id: uuidv4(), date: '2026-04-05', amount: 1200, category: 'Freelance', type: 'income', note: 'Web project' },
];

export const useFinanceStore = create((set, get) => ({
  transactions: JSON.parse(localStorage.getItem('finance_transactions')) || initialTransactions,
  role: 'admin', 
  filterCategory: 'All',
  searchQuery: '',
  
  // Gamification & Tracking states
  monthlyBudget: 1000,

  setRole: (role) => set({ role }),
  setFilterCategory: (category) => set({ filterCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addTransaction: (transaction) => {
    set((state) => {
      const newTransactions = [{ id: uuidv4(), ...transaction }, ...state.transactions];
      localStorage.setItem('finance_transactions', JSON.stringify(newTransactions));
      return { transactions: newTransactions };
    });
  },

  deleteTransaction: (id) => {
    set((state) => {
      const newTransactions = state.transactions.filter(t => t.id !== id);
      localStorage.setItem('finance_transactions', JSON.stringify(newTransactions));
      return { transactions: newTransactions };
    });
  },

  // Derived state calculations
  getStats: () => {
    const { transactions } = get();
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const balance = income - expenses;
    return { income, expenses, balance };
  },

  getMonthlyStats: () => {
    const { transactions } = get();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    
    transactions.forEach(t => {
      const date = parseISO(t.date);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        if (t.type === 'income') monthlyIncome += Number(t.amount);
        if (t.type === 'expense') monthlyExpense += Number(t.amount);
      }
    });
    
    return { monthlyIncome, monthlyExpense };
  },

  getCategorySpending: () => {
    const { transactions } = get();
    const categoryTotals = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
      }
    });
    return Object.keys(categoryTotals).map(name => ({
      name,
      value: categoryTotals[name]
    })).sort((a, b) => b.value - a.value); 
  },

  // Returns spending per category for a given month/year (month: 0-11).
  // Defaults to current month if no args provided.
  getMonthlyCategorySpending: (year, month) => {
    const { transactions } = get();
    const now = new Date();
    const targetYear = typeof year === 'number' ? year : now.getFullYear();
    const targetMonth = typeof month === 'number' ? month : now.getMonth();

    const categoryTotals = {};
    transactions.forEach(t => {
      if (t.type !== 'expense') return;
      const date = parseISO(t.date);
      if (date.getFullYear() === targetYear && date.getMonth() === targetMonth) {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
      }
    });

    return Object.keys(categoryTotals).map(name => ({
      name,
      value: categoryTotals[name]
    })).sort((a, b) => b.value - a.value);
  },

  getBalanceTrend: () => {
    const { transactions } = get();
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentBalance = 0;
    const trendMap = new Map();
    sorted.forEach(t => {
      const change = t.type === 'income' ? Number(t.amount) : -Number(t.amount);
      currentBalance += change;
      trendMap.set(t.date, currentBalance);
    });
    return Array.from(trendMap.keys()).map(date => ({
      date,
      balance: trendMap.get(date)
    }));
  },

  getGamificationStats: () => {
    const { transactions, getStats, goal } = get();

    // Streaks - days since last expense
    const expenses = transactions.filter(t => t.type === 'expense').sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let savingStreak = 0;
    if (expenses.length > 0) {
      const lastExpenseDate = parseISO(expenses[0].date);
      // We use 'today' as 2026-04-05 assuming environment, or just Date.now()
      const today = new Date();
      savingStreak = Math.max(0, differenceInDays(today, lastExpenseDate));
    } else {
      savingStreak = 10; // If no expenses ever
    }

    const { balance } = getStats();
    const goalTarget = goal && goal.target ? Number(goal.target) : null;
    const goalProgress = goalTarget ? Math.min(100, Math.max(0, (balance / goalTarget) * 100)) : 0;

    // Achievements
    const achievements = [];
    if (goalProgress >= 100) achievements.push("Goal Reached! 🏆");
    if (savingStreak >= 3) achievements.push("3-Day Streak 🔥");
    if (transactions.filter(t => t.type === 'income').length >= 2) achievements.push("Hustler 💼");

    return { savingStreak, goalProgress, achievements };
  }
}));
