import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppShell } from './components/layout/AppShell';
import { ConcoursePage } from './pages/OverviewPage';
import { ServicesPage } from './pages/ServicesPage';
import { TopologyPage } from './pages/TopologyPage';
import { TimelinesPage } from './pages/TimelinesPage';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { TelemetrySimulatorPage } from './pages/TelemetrySimulatorPage';
import { SdkPortalPage } from './pages/SdkPortalPage';
import { SdkDocsPage } from './pages/SdkDocsPage';
import { SdkPlaygroundPage } from './pages/SdkPlaygroundPage';
import { LandingPage } from './pages/LandingPage';
import { useRuntimeHealth, useDashboardTrends } from './services/useTelemetryStore';
import { DeparturesBoard } from './components/dashboard/DeparturesBoard';

function App() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [dispatchedDepartures, setDispatchedDepartures] = useState([]);
  const { data: healthData } = useRuntimeHealth();
  const { data: dashboardTrends } = useDashboardTrends();

  const handleDispatch = (newDeparture) => {
    setDispatchedDepartures((prev) => [newDeparture, ...prev].slice(0, 10));
  };

  return (
    <Routes>
      {/* ─── Standalone Landing Page (No AppShell Sidebar/Header) ─────────── */}
      <Route path="/" element={<LandingPage />} />

      {/* ─── SaaS Application Routes (Wrapped inside AppShell) ───────────── */}
      <Route
        path="/*"
        element={
          <AppShell activeFilter={activeFilter} onFilterChange={setActiveFilter}>
            <Routes>
              <Route
                path="/concourse"
                element={
                  <div className="space-y-6 animate-fade-in">
                    <ConcoursePage
                      healthData={healthData}
                      dashboardTrends={dashboardTrends}
                    />
                    <div className="mt-6">
                      <DeparturesBoard departures={dispatchedDepartures} />
                    </div>
                  </div>
                }
              />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/topology" element={<TopologyPage />} />
              <Route path="/timelines" element={<TimelinesPage />} />
              <Route path="/anomalies" element={<AnomaliesPage activeFilter={activeFilter} />} />
              <Route
                path="/simulator"
                element={<TelemetrySimulatorPage onDispatch={handleDispatch} />}
              />
              <Route path="/sdk" element={<SdkPortalPage />} />
              <Route path="/sdk/docs" element={<SdkDocsPage />} />
              <Route path="/sdk/playground" element={<SdkPlaygroundPage />} />
            </Routes>

            <Toaster position="bottom-right" theme="dark" />
          </AppShell>
        }
      />
    </Routes>
  );
}

export default App;
