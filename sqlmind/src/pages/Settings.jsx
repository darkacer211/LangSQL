import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { setTheme } from '../redux/slices/themeSlice'
import DashboardLayout from '../components/layout/DashboardLayout'

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { isDark } = useSelector((state) => state.theme)
  const dispatch = useDispatch()

  const handleThemeChange = (event) => {
    const theme = event.target.value
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      dispatch(setTheme(systemDark))
    } else {
      dispatch(setTheme(theme === 'dark'))
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement settings save
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile settings */}
          <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-accent text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  defaultValue="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-accent text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  defaultValue="john@example.com"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Preferences</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium mb-2">
                  Theme
                </label>
                <select
                  id="theme"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-accent text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={isDark ? 'dark' : 'light'}
                  onChange={handleThemeChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label htmlFor="language" className="block text-sm font-medium mb-2">
                  Language
                </label>
                <select
                  id="language"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-accent text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Email notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about your queries and schemas
                  </p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-accent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <span
                    className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-primary shadow ring-0 transition duration-200 ease-in-out"
                    style={{ transform: 'translateX(0px)' }}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Push notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-accent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <span
                    className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-primary shadow ring-0 transition duration-200 ease-in-out"
                    style={{ transform: 'translateX(0px)' }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-background p-6 rounded-xl border border-destructive shadow-sm">
            <h2 className="text-xl font-semibold text-destructive mb-6">Danger Zone</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Delete account</h3>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm font-medium disabled:opacity-50"
            >
              {isLoading && (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              )}
              <span>Save changes</span>
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Settings 