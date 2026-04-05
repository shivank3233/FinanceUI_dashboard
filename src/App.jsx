import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardOverview } from './components/DashboardOverview';
import { TransactionList } from './components/TransactionList';
import { InsightsPanel } from './components/InsightsPanel';
import { StoryWrap } from './components/StoryWrap';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === 'dashboard' && <DashboardOverview />}
      {currentTab === 'transactions' && <TransactionList />}
      {currentTab === 'insights' && <InsightsPanel />}
      {currentTab === 'story' && <StoryWrap />}
    </Layout>
  );
}

export default App;
