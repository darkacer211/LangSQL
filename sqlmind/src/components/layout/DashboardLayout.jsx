import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard,
  Database,
  Table,
  Settings,
  User,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react'
import { logout } from '../../redux/slices/authSlice'
import { toggleTheme } from '../../redux/slices/themeSlice'
import { useToast } from '../../contexts/ToastContext'

const DashboardLayout = ({ children }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { isDark } = useSelector((state) => state.theme)
  const { showSuccess } = useToast()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Query Builder', href: '/query-builder', icon: Database, description: 'Build and execute SQL queries with AI assistance' },
    { name: 'Schema Generator', href: '/schema-generator', icon: Table, description: 'Design and generate database schemas' },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleLogout = () => {
    dispatch(logout())
    showSuccess('Logged out successfully')
  }

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0B] transition-colors">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-[#111113] border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center gap-3">
                <img
                  src={isDark ? "/Logo-White.png" : "/Logo-Dark.png"}
                  alt="LangSQL Logo"
                  className="h-8"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-[#00E5FF] bg-clip-text text-transparent">
                  LangSQL
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-500 dark:bg-[#00E5FF] text-white dark:text-black'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#0A0A0B] hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right section with theme toggle and user menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#0A0A0B] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#0A0A0B] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111113] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-1 transition-colors">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#0A0A0B] hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <main className="transition-colors">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout 