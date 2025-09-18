import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { LogOut, MapPin, Settings } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth()
  // const location = useLocation()
  const navigate = useNavigate()
  const { logout: clearAuthStore } = useAuthStore()

  const handleLogout = async () => {
    try {
      console.log('Starting logout process')
      await authService.logout()
      console.log('Firebase logout successful')
      clearAuthStore() // Очищаємо локальний стан
      console.log('Local auth store cleared')
      navigate('/login') // Перенаправляємо на сторінку входу
      console.log('Navigated to login page')
    } catch (error) {
      console.error('Logout error:', error)
      // Навіть якщо є помилка, очищаємо локальний стан
      clearAuthStore()
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/trips" className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">TravelPlanner</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/email-setup">
                  <Settings className="h-4 w-4 mr-2" />
                  Email Setup
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
