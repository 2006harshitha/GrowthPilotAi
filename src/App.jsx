// src/App.jsx
import { useState } from 'react';
import { AppProvider } from './store/useAppStore.jsx';
import Layout from './components/layout/Layout.jsx';
import Dashboard from './modules/dashboard/Dashboard.jsx';
import ChannelAnalytics from './modules/channels/ChannelAnalytics.jsx';
import AmbassadorManager from './modules/ambassadors/AmbassadorManager.jsx';
import ExperimentLab from './modules/experiments/ExperimentLab.jsx';
import AIGrowthAdvisor from './modules/advisor/AIGrowthAdvisor.jsx';
import CampaignPlanner from './modules/planner/CampaignPlanner.jsx';
import ScenarioSimulator from './modules/simulator/ScenarioSimulator.jsx';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const pages = {
    dashboard:   <Dashboard />,
    channels:    <ChannelAnalytics />,
    ambassadors: <AmbassadorManager />,
    experiments: <ExperimentLab />,
    advisor:     <AIGrowthAdvisor />,
    planner:     <CampaignPlanner />,
    simulator:   <ScenarioSimulator />,
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {pages[currentPage] || <Dashboard />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
