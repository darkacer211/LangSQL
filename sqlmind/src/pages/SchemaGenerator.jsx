import { useState } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import {
  Database,
  Download,
  Copy,
  Wand2,
  Save,
  Table,
  History,
  ChevronRight,
  ChevronDown,
  Clock,
  Sparkles
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useToast } from '../contexts/ToastContext'
import { useSelector } from 'react-redux'

const SchemaGenerator = () => {
  const [schemaDescription, setSchemaDescription] = useState('')
  const [generatedSchema, setGeneratedSchema] = useState('')
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedSchemas] = useState([
    {
      name: "Blog Database Schema",
      description: "A blog database with users, posts, and comments tables",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      schema: `CREATE TABLE users (...);\nCREATE TABLE posts (...);\nCREATE TABLE comments (...);`
    },
    {
      name: "E-commerce Database",
      description: "Complete e-commerce system with products, orders, and customers",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      schema: `CREATE TABLE products (...);\nCREATE TABLE orders (...);\nCREATE TABLE customers (...);`
    },
    {
      name: "Task Management System",
      description: "Project management database with tasks, projects, and users",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      schema: `CREATE TABLE tasks (...);\nCREATE TABLE projects (...);\nCREATE TABLE users (...);`
    }
  ])
  const { showSuccess, showError } = useToast()
  const { isDark } = useSelector((state) => state.theme)

  const handleGenerateSchema = async () => {
    if (!schemaDescription.trim()) {
      showError('Please describe your database schema requirements')
      return
    }
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setGeneratedSchema(`CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);`)
      setOptimizationSuggestions([
        'Consider adding an index on user_id in the orders table for faster lookups',
        'Partitioning the orders table by created_at will improve OLAP queries',
        'Adding a composite index on (user_id, created_at) will optimize common queries'
      ])
      setIsGenerating(false)
      showSuccess('Schema generated successfully!')
    }, 2000)
  }

  const handleCopySchema = () => {
    navigator.clipboard.writeText(generatedSchema)
    showSuccess('Schema copied to clipboard!')
  }

  const handleDownloadSchema = () => {
    const blob = new Blob([generatedSchema], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schema.sql'
    a.click()
    URL.revokeObjectURL(url)
    showSuccess('Schema downloaded!')
  }

  return (
    <DashboardLayout>
      <div className="h-screen bg-background text-foreground">
        <div className="flex h-full">
          {/* Left Section - Schema Templates */}
          <div className="w-72 border-r border-border overflow-y-auto bg-background shadow-lg">
            <div className="p-4 sticky top-0 bg-background z-10 border-b border-border backdrop-blur-sm bg-background/80">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold tracking-tight">Templates</h2>
                <button 
                  className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:shadow-sm"
                  title="Refresh"
                >
                  <History className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {['Blog System', 'E-commerce', 'Social Network', 'Task Management'].map((template) => (
                  <button
                    key={template}
                    className="flex items-center w-full p-3 rounded-lg text-sm transition-all duration-200 hover:bg-accent hover:shadow-sm"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    {template}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section - Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-border bg-background">
            <div className="p-8 space-y-6 max-w-[1200px] mx-auto w-full">
              {/* Input Section */}
              <div className="space-y-4 bg-background p-8 rounded-xl shadow-sm border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold tracking-tight">Describe Your Schema</h2>
                  <div className="flex items-center space-x-2 px-4 py-1.5 bg-accent rounded-lg shadow-sm">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm">AI-Powered</span>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={schemaDescription}
                    onChange={(e) => setSchemaDescription(e.target.value)}
                    placeholder="Describe your database schema in plain English. For example: 'Create a blog database with users, posts, and comments tables'"
                    className="w-full h-32 p-5 text-base border border-border rounded-xl bg-accent text-foreground resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button
                  onClick={handleGenerateSchema}
                  disabled={isGenerating || !schemaDescription.trim()}
                  className="w-full px-5 py-3.5 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-lg flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm font-medium"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Schema</span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Schema Section */}
              <div className="space-y-4 bg-background p-8 rounded-xl shadow-sm border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold tracking-tight">Generated Schema</h2>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleCopySchema}
                      disabled={!generatedSchema}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDownloadSchema}
                      disabled={!generatedSchema}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Download schema"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {}}
                      disabled={!generatedSchema}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Save schema"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="relative h-56 rounded-xl overflow-hidden border border-border shadow-sm">
                  <Editor
                    height="100%"
                    defaultLanguage="sql"
                    value={generatedSchema}
                    theme={isDark ? "vs-dark" : "light"}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      padding: { top: 10, bottom: 10 },
                      roundedSelection: true,
                    }}
                  />
                </div>

                {optimizationSuggestions.length > 0 && (
                  <div className="flex-1 p-5 bg-accent rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium mb-2">AI Suggestions:</h3>
                    <ul className="space-y-2">
                      {optimizationSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                          <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - History */}
          <div className="w-80 overflow-y-auto bg-background shadow-lg">
            <div className="p-6 space-y-8">
              {/* Saved Schemas */}
              <div>
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-background/80 backdrop-blur-sm py-2">
                  <h2 className="text-lg font-semibold tracking-tight">Saved Schemas</h2>
                  <button 
                    className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 hover:shadow-sm"
                    title="Clear History"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {savedSchemas.map((schema, index) => (
                    <div
                      key={index}
                      className="p-4 bg-accent rounded-lg cursor-pointer hover:bg-accent/90 transition-colors duration-200 border border-border"
                      onClick={() => setGeneratedSchema(schema.schema)}
                    >
                      <p className="text-sm font-medium mb-1">{schema.name}</p>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {schema.description}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{schema.timestamp.toLocaleString()}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SchemaGenerator 