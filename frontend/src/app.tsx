import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PageLayout } from '@/components/layout/PageLayout'
import { Dashboard } from '@/pages/Dashboard'
import { IPCheckerPage } from '@/pages/IPCheckerPage'
import { ProxyCheckerPage } from '@/pages/ProxyCheckerPage'
import { BulkCheckerPage } from '@/pages/BulkCheckerPage'
import { HistoryPage } from '@/pages/HistoryPage'

export default function App() {
  return (
    <Router>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ip" element={<IPCheckerPage />} />
          <Route path="/proxy" element={<ProxyCheckerPage />} />
          <Route path="/bulk" element={<BulkCheckerPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </PageLayout>
    </Router>
  )
}
