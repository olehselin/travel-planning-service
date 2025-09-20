import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { TripsPage } from './pages/TripsPage'
import { TripDetailsPage } from './pages/TripDetailsPage'
import { TripAccessPage } from './pages/TripAccessPage'
import { AcceptInvitePage } from './pages/AcceptInvitePage'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<TripsPage />} />
                      <Route path="/trips" element={<TripsPage />} />
                      <Route path="/trips/:id" element={<TripDetailsPage />} />
                      <Route path="/trips/:id/access" element={<TripAccessPage />} />
                    </Routes>
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
