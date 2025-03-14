import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Database,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  ChevronRight,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useSelector } from 'react-redux'
import { useToast } from '../contexts/ToastContext'

const ManageDatabases = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { showSuccess, showError } = useToast()
  const [connections] = useState([
    {
      id: 1,
      name: 'Local PostgreSQL',
      type: 'PostgreSQL',
      host: 'localhost',
      port: 5432,
      database: 'myapp_db',
      status: 'connected',
      lastConnected: '2024-03-15 10:30 AM'
    },
    {
      id: 2,
      name: 'Production MySQL',
      type: 'MySQL',
      host: 'prod-db.example.com',
      port: 3306,
      database: 'prod_db',
      status: 'disconnected',
      lastConnected: '2024-03-14 05:45 PM'
    },
    {
      id: 3,
      name: 'Analytics Trino',
      type: 'Trino',
      host: 'trino.internal',
      port: 8080,
      database: 'analytics',
      status: 'connected',
      lastConnected: '2024-03-15 09:15 AM'
    }
  ])

  const handleTestConnection = async (id) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      showSuccess('Connection tested successfully!')
    } catch (error) {
      showError('Failed to test connection')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConnection = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      showSuccess('Connection deleted successfully!')
    } catch (error) {
      showError('Failed to delete connection')
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Databases</h1>
              <p className="text-muted-foreground">
                Manage and monitor your database connections
              </p>
            </div>
            <button
              onClick={() => {}}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Connection</span>
            </button>
          </div>

          {/* Connections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="bg-background p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Database className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{connection.name}</h3>
                      <p className="text-sm text-muted-foreground">{connection.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {connection.status === 'connected' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Host:</span>
                    <span>{connection.host}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Port:</span>
                    <span>{connection.port}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Database:</span>
                    <span>{connection.database}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Connected:</span>
                    <span>{connection.lastConnected}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTestConnection(connection.id)}
                      disabled={isLoading}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                      title="Test Connection"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {}}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                      title="Edit Connection"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteConnection(connection.id)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors text-destructive"
                      title="Delete Connection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {}}
                    className="flex items-center space-x-1 text-sm text-primary hover:text-primary/90 transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageDatabases 