import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Search, Plus, Trash2, Filter } from 'lucide-react';
import { playSound } from '../utils/audio';
import './TransactionList.css';

export function TransactionList() {
  const { transactions, role, deleteTransaction, addTransaction } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New transaction form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Groceries',
    type: 'expense',
    note: ''
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.note) return;
    
    addTransaction({
      ...formData,
      amount: Number(formData.amount)
    });
    
    // Play interaction sound
    playSound(formData.type);

    setIsModalOpen(false);
    setFormData({ ...formData, amount: '', note: '' }); // reset
  };

  return (
    <div className="transaction-list-container">
      <div className="list-header">
        <div className="filters">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-select">
            <Filter size={18} className="filter-icon" />
            <select 
              className="input-field" 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
        
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Transaction
          </button>
        )}
      </div>

      <div className="table-container glass-panel">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Details</th>
              <th>Category</th>
              <th>Amount</th>
              {role === 'admin' && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <tr key={t.id}>
                  <td className="text-secondary">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="font-medium">{t.note}</td>
                  <td>
                    <span className="category-tag">{t.category}</span>
                  </td>
                  <td>
                    <span className={`amount ${t.type === 'income' ? 'text-success' : ''}`}>
                      {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td className="text-right">
                      <button 
                        className="btn-icon text-danger" 
                        onClick={() => {
                          deleteTransaction(t.id);
                          playSound('expense'); // Play a thud on delete
                        }}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'admin' ? 5 : 4} className="empty-table">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && role === 'admin' && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in">
            <h2>Add New Transaction</h2>
            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="input-group">
                <label className="input-label">Type</label>
                <select 
                  className="input-field"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              
              <div className="input-group">
                <label className="input-label">Date</label>
                <input 
                  type="date" 
                  className="input-field" required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Amount ($)</label>
                <input 
                  type="number" step="0.01" min="0" 
                  className="input-field" required placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select 
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {formData.type === 'expense' ? (
                    <>
                      <option value="Groceries">Groceries</option>
                      <option value="Transport">Transport</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Dining">Dining</option>
                      <option value="Other">Other Expense</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investment">Investment</option>
                      <option value="Other">Other Income</option>
                    </>
                  )}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Note/Description</label>
                <input 
                  type="text" 
                  className="input-field" required placeholder="What was this for?"
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
