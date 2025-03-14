import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Copy, 
  Save, 
  Download, 
  Table, 
  Clock, 
  Database, 
  ChevronRight, 
  ChevronDown, 
  TableProperties,
  Columns,
  Key,
  RefreshCw,
  Wand2,
  Sparkles,
  MessageSquare,
  Zap,
  History
} from 'lucide-react'
import Editor from '@monaco-editor/react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useSelector } from 'react-redux'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'

const QueryBuilder = () => {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [selectedDb, setSelectedDb] = useState(null)
  const [expandedSchemas, setExpandedSchemas] = useState({})
  const [expandedTables, setExpandedTables] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [results, setResults] = useState(null)
  const [savedQueries, setSavedQueries] = useState([
    {
      query: "Show me all users who have made purchases in the last month",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      generated: "SELECT u.username, COUNT(o.order_id) as order_count, SUM(o.total_amount) as total_spent FROM users u JOIN orders o ON u.id = o.user_id WHERE o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH) GROUP BY u.username"
    },
    {
      query: "Find the top 5 most expensive products in Electronics category",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      generated: "SELECT name, price, category FROM products WHERE category = 'Electronics' ORDER BY price DESC LIMIT 5"
    },
    {
      query: "List all orders with their customer details",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      generated: "SELECT o.order_id, u.username, o.total_amount, o.status FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.order_date DESC"
    }
  ])
  const [executionHistory] = useState([
    {
      query: "SELECT * FROM products WHERE category = 'Electronics'",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      metadata: {
        rowCount: 15,
        executionTime: '0.124s',
        affectedRows: 15
      }
    },
    {
      query: "UPDATE products SET stock = stock - 1 WHERE product_id = 101",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      metadata: {
        rowCount: 1,
        executionTime: '0.086s',
        affectedRows: 1
      }
    },
    {
      query: "SELECT COUNT(*) as total_orders, SUM(total_amount) as revenue FROM orders WHERE status = 'completed'",
      timestamp: new Date(Date.now() - 1000 * 60 * 90), // 90 mins ago
      metadata: {
        rowCount: 1,
        executionTime: '0.156s',
        affectedRows: 0
      }
    }
  ])
  const { isDark } = useSelector((state) => state.theme)
  const { showSuccess, showError } = useToast()
  const { activeConnection } = useSelector((state) => state.database)
  const [aiMode, setAiMode] = useState('natural') // 'natural' | 'sql'
  const [explanation, setExplanation] = useState(null)
  const [optimization, setOptimization] = useState(null)
  const [isExplaining, setIsExplaining] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  // Mock databases and their schemas (replace with real data from your backend)
  const mockDatabases = [
    {
      name: 'ecommerce_db',
      schemas: [
        {
          name: 'public',
          tables: [
            {
              name: 'users',
              columns: [
                { name: 'id', type: 'integer', isPrimary: true },
                { name: 'username', type: 'varchar(50)', isPrimary: false },
                { name: 'email', type: 'varchar(100)', isPrimary: false },
                { name: 'created_at', type: 'timestamp', isPrimary: false }
              ]
            },
            {
              name: 'products',
              columns: [
                { name: 'product_id', type: 'integer', isPrimary: true },
                { name: 'name', type: 'varchar(100)', isPrimary: false },
                { name: 'price', type: 'decimal(10,2)', isPrimary: false },
                { name: 'category', type: 'varchar(50)', isPrimary: false }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'analytics_db',
      schemas: [
        {
          name: 'public',
          tables: [
            {
              name: 'events',
              columns: [
                { name: 'event_id', type: 'integer', isPrimary: true },
                { name: 'event_type', type: 'varchar(50)', isPrimary: false },
                { name: 'timestamp', type: 'timestamp', isPrimary: false }
              ]
            }
          ]
        }
      ]
    }
  ]

  const toggleSchema = (dbName, schemaName) => {
    setExpandedSchemas(prev => ({
      ...prev,
      [`${dbName}.${schemaName}`]: !prev[`${dbName}.${schemaName}`]
    }))
  }

  const toggleTable = (dbName, schemaName, tableName) => {
    setExpandedTables(prev => ({
      ...prev,
      [`${dbName}.${schemaName}.${tableName}`]: !prev[`${dbName}.${schemaName}.${tableName}`]
    }))
  }

  const handleSelectDatabase = (dbName) => {
    setSelectedDb(dbName)
    showSuccess(`Connected to ${dbName}`)
  }

  const handleTableClick = (tableName) => {
    setOutput(`SELECT * FROM ${tableName} LIMIT 100;`)
  }

  const handleNaturalLanguageQuery = async () => {
    if (!input.trim() || !selectedDb) return
    
    setIsLoading(true)
    try {
      // TODO: Call your AI service to convert natural language to SQL
      await new Promise(resolve => setTimeout(resolve, 1000))
      const query = 'SELECT u.username, COUNT(o.order_id) as order_count ' +
                   'FROM users u ' +
                   'LEFT JOIN orders o ON u.id = o.user_id ' +
                   'GROUP BY u.username ' +
                   'HAVING COUNT(o.order_id) > 5;'
      setOutput(query)
      setSuggestions([
        'You might also want to include the total order value',
        'Consider adding a date range filter',
        'You could join with the products table to see what they bought'
      ])
      showSuccess('Query generated successfully!')
    } catch (error) {
      showError('Failed to generate query')
      console.error('Failed to generate query:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExplainQuery = async () => {
    if (!output.trim()) return
    
    setIsExplaining(true)
    try {
      // TODO: Call your AI service to explain the query
      await new Promise(resolve => setTimeout(resolve, 800))
      setExplanation({
        overview: "This query finds users who have placed more than 5 orders",
        steps: [
          "Joins the users table with orders table",
          "Groups results by username",
          "Filters for users with more than 5 orders",
          "Returns username and order count"
        ],
        performance: "The query uses an index on user_id for efficient joining"
      })
      showSuccess('Query explained!')
    } catch (error) {
      showError('Failed to explain query')
    } finally {
      setIsExplaining(false)
    }
  }

  const handleOptimizeQuery = async () => {
    if (!output.trim()) return
    
    setIsOptimizing(true)
    try {
      // TODO: Call your AI service to optimize the query
      await new Promise(resolve => setTimeout(resolve, 800))
      setOptimization({
        optimizedQuery: output.replace('SELECT *', 'SELECT id, username, email'),
        improvements: [
          "Replaced SELECT * with specific columns",
          "Added index hint for better performance",
          "Restructured JOIN for better execution plan"
        ],
        estimatedImprovement: "~40% performance increase"
      })
      showSuccess('Query optimized!')
    } catch (error) {
      showError('Failed to optimize query')
    } finally {
      setIsOptimizing(false)
    }
  }

  // Mock data scenarios
  const mockDataScenarios = {
    users: {
      data: [
        { id: 1, username: 'john_doe', email: 'john@example.com', age: 25, created_at: '2024-01-15' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', age: 30, created_at: '2024-02-01' },
        { id: 3, username: 'bob_wilson', email: 'bob@example.com', age: 28, created_at: '2024-02-15' },
        { id: 4, username: 'alice_brown', email: 'alice@example.com', age: 35, created_at: '2024-03-01' },
      ],
      metadata: {
        rowCount: 4,
        executionTime: '0.086s',
        affectedRows: 4,
      }
    },
    products: {
      data: [
        { product_id: 101, name: 'Laptop Pro', category: 'Electronics', price: 1299.99, stock: 50 },
        { product_id: 102, name: 'Wireless Mouse', category: 'Accessories', price: 29.99, stock: 100 },
        { product_id: 103, name: 'Gaming Monitor', category: 'Electronics', price: 499.99, stock: 25 },
        { product_id: 104, name: 'Mechanical Keyboard', category: 'Accessories', price: 149.99, stock: 75 },
      ],
      metadata: {
        rowCount: 4,
        executionTime: '0.092s',
        affectedRows: 4,
      }
    },
    orders: {
      data: [
        { order_id: 1001, user_id: 1, total_amount: 1329.98, status: 'completed', order_date: '2024-03-10' },
        { order_id: 1002, user_id: 2, total_amount: 499.99, status: 'processing', order_date: '2024-03-11' },
        { order_id: 1003, user_id: 3, total_amount: 179.98, status: 'pending', order_date: '2024-03-12' },
      ],
      metadata: {
        rowCount: 3,
        executionTime: '0.078s',
        affectedRows: 3,
      }
    },
    aggregate: {
      data: [
        { category: 'Electronics', total_sales: 8999.93, avg_price: 899.99, item_count: 10 },
        { category: 'Accessories', total_sales: 2999.80, avg_price: 89.99, item_count: 25 },
        { category: 'Software', total_sales: 1499.95, avg_price: 49.99, item_count: 15 },
      ],
      metadata: {
        rowCount: 3,
        executionTime: '0.156s',
        affectedRows: 3,
      }
    },
    empty: {
      data: [],
      metadata: {
        rowCount: 0,
        executionTime: '0.042s',
        affectedRows: 0,
      }
    },
    update: {
      data: [],
      metadata: {
        rowCount: 0,
        executionTime: '0.064s',
        affectedRows: 5,
      }
    }
  }

  const handleExecute = async () => {
    if (!output.trim()) {
      showError('Please generate or write a SQL query first')
      return
    }
    
    if (!activeConnection) {
      showError('Please connect to a database first')
      return
    }

    setIsExecuting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Determine which mock data to return based on the query content
      const query = output.toLowerCase()
      let mockResult

      if (query.includes('update ') || query.includes('delete ') || query.includes('insert ')) {
        mockResult = mockDataScenarios.update
      } else if (query.includes('count(') || query.includes('sum(') || query.includes('avg(')) {
        mockResult = mockDataScenarios.aggregate
      } else if (query.includes('product')) {
        mockResult = mockDataScenarios.products
      } else if (query.includes('order')) {
        mockResult = mockDataScenarios.orders
      } else if (query.includes('user')) {
        mockResult = mockDataScenarios.users
      } else if (query.includes('where') && query.includes('not exists')) {
        mockResult = mockDataScenarios.empty
      } else {
        // Default to users if no specific match
        mockResult = mockDataScenarios.users
      }

      setResults(mockResult)
      showSuccess(mockResult.data.length > 0 ? 'Query executed successfully!' : 'Query executed successfully (no results)')
    } catch (error) {
      showError('Failed to execute query')
      console.error('Failed to execute query:', error)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    showSuccess('Query copied to clipboard!')
  }

  const handleSave = () => {
    if (!output) return
    setSavedQueries([...savedQueries, { query: output, timestamp: new Date() }])
    showSuccess('Query saved successfully!')
  }

  const handleDownload = () => {
    if (!results) return
    const csv = [
      Object.keys(results.data[0]).join(','),
      ...results.data.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const element = document.createElement('a')
    const file = new Blob([csv], { type: 'text/csv' })
    element.href = URL.createObjectURL(file)
    element.download = 'query_results.csv'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    showSuccess('Results downloaded successfully!')
  }

  // Database connection prompt component
  const ConnectionPrompt = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
      <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No Database Connected</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
        Please connect to a database to start generating and executing queries.
      </p>
      <button
        onClick={() => navigate('/connect-database')}
        className="btn btn-primary flex items-center space-x-2"
      >
        <Database className="w-4 h-4" />
        <span>Connect Database</span>
      </button>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="h-screen bg-background text-foreground">
        <div className="flex h-full">
          {/* Database Sidebar - Left Section */}
          <div className="w-72 border-r border-border overflow-y-auto bg-background shadow-lg">
            <div className="p-4 sticky top-0 bg-background z-10 border-b border-border backdrop-blur-sm bg-background/80">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold tracking-tight">Databases</h2>
                <button 
                  className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:shadow-sm"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {mockDatabases.map(db => (
                  <div key={db.name} className="space-y-1">
                    <button
                      onClick={() => handleSelectDatabase(db.name)}
                      className={`flex items-center w-full p-3 rounded-lg text-sm transition-all duration-200 ${
                        selectedDb === db.name 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'hover:bg-accent hover:shadow-sm'
                      }`}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      {db.name}
                    </button>
                    {selectedDb === db.name && (
                      <div className="ml-4">
                        {db.schemas.map(schema => (
                          <div key={schema.name}>
                            <button
                              onClick={() => toggleSchema(db.name, schema.name)}
                              className="flex items-center w-full p-2.5 text-sm hover:bg-accent rounded-lg transition-all duration-200"
                            >
                              {expandedSchemas[`${db.name}.${schema.name}`] ? (
                                <ChevronDown className="w-3 h-3 mr-2" />
                              ) : (
                                <ChevronRight className="w-3 h-3 mr-2" />
                              )}
                              <TableProperties className="w-4 h-4 mr-2" />
                              {schema.name}
                            </button>
                            {expandedSchemas[`${db.name}.${schema.name}`] && (
                              <div className="ml-7">
                                {schema.tables.map(table => (
                                  <div key={table.name}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleTableClick(table.name)
                                      }}
                                      className="flex items-center w-full p-2.5 text-sm hover:bg-accent rounded-lg transition-all duration-200 group"
                                    >
                                      {expandedTables[`${db.name}.${schema.name}.${table.name}`] ? (
                                        <ChevronDown className="w-3 h-3 mr-2" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3 mr-2" />
                                      )}
                                      <Table className="w-4 h-4 mr-2" />
                                      {table.name}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleTableClick(table.name)
                                        }}
                                        className="ml-auto opacity-0 group-hover:opacity-100 p-1.5 hover:bg-accent/20 rounded-md transition-all duration-200"
                                        title="Query table"
                                      >
                                        <Play className="w-3 h-3" />
                                      </button>
                                    </button>
                                    {expandedTables[`${db.name}.${schema.name}.${table.name}`] && (
                                      <div className="ml-7 border-l border-border">
                                        {table.columns.map(column => (
                                          <div
                                            key={column.name}
                                            className="flex items-center p-2 text-sm"
                                          >
                                            {column.isPrimary ? (
                                              <Key className="w-3 h-3 mr-2 text-primary" />
                                            ) : (
                                              <Columns className="w-3 h-3 mr-2" />
                                            )}
                                            <span className="text-foreground">
                                              {column.name}
                                            </span>
                                            <span className="ml-2 text-xs text-muted-foreground">
                                              {column.type}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Middle Section */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-border bg-background">
            <div className="p-8 space-y-6 max-w-[1200px] mx-auto w-full">
              {/* Mode Toggle */}
              <div className="flex items-center space-x-4 mb-8 bg-background p-1.5 rounded-lg border border-border shadow-sm">
                <button
                  onClick={() => setAiMode('natural')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg flex-1 justify-center transition-all duration-200 ${
                    aiMode === 'natural'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent hover:shadow-sm'
                  }`}
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Natural Language</span>
                </button>
                <button
                  onClick={() => setAiMode('sql')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg flex-1 justify-center transition-all duration-200 ${
                    aiMode === 'sql'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent hover:shadow-sm'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>SQL</span>
                </button>
              </div>

              {/* Input Section */}
              {aiMode === 'natural' && (
                <div className="space-y-4 bg-background p-8 rounded-xl shadow-sm border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold tracking-tight">Describe your query</h2>
                    <div className="flex items-center space-x-2 px-4 py-1.5 bg-accent rounded-lg shadow-sm">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm">AI-Powered</span>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Describe what you want to query in plain English. For example: 'Show me all users who have placed more than 5 orders'"
                      className="w-full h-32 p-5 text-base border border-border rounded-xl bg-accent text-foreground resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={handleNaturalLanguageQuery}
                    disabled={isLoading || !input.trim() || !selectedDb}
                    className="w-full px-5 py-3.5 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-lg flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm font-medium"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        <span>Generate SQL</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* SQL Editor Section */}
              <div className="space-y-4 bg-background p-8 rounded-xl shadow-sm border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold tracking-tight">SQL Query</h2>
                    {selectedDb && (
                      <span className="px-4 py-1.5 bg-accent text-accent-foreground rounded-lg text-sm shadow-sm">
                        Connected to: {selectedDb}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleExplainQuery}
                      disabled={!output || isExplaining}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Explain Query"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleOptimizeQuery}
                      disabled={!output || isOptimizing}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Optimize Query"
                    >
                      <Zap className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCopy}
                      disabled={!output}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!output}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Save query"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="relative h-56 rounded-xl overflow-hidden border border-border shadow-sm">
                  <Editor
                    height="100%"
                    defaultLanguage="sql"
                    value={output}
                    onChange={setOutput}
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

                <div className="flex justify-between items-start">
                  {suggestions.length > 0 && (
                    <div className="flex-1 mr-6 p-5 bg-accent rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium mb-2">AI Suggestions:</h3>
                      <ul className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                            <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    onClick={handleExecute}
                    disabled={isExecuting || !output.trim() || !selectedDb}
                    className="px-6 py-3.5 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-lg flex items-center space-x-3 transition-all duration-200 shadow-sm font-medium"
                  >
                    {isExecuting ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Execute</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Results Section */}
              {results && (
                <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
                  <div className="p-5 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{results.metadata.executionTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Table className="w-4 h-4" />
                          <span>{results.metadata.rowCount} rows</span>
                        </div>
                      </div>
                      <button
                        onClick={handleDownload}
                        className="px-5 py-2.5 bg-accent hover:bg-accent/90 rounded-lg flex items-center space-x-3 transition-all duration-200 shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-accent/80 backdrop-blur-sm sticky top-0">
                          {results.data.length > 0 && Object.keys(results.data[0]).map((key) => (
                            <th
                              key={key}
                              className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {results.data.map((row, i) => (
                          <tr
                            key={i}
                            className="hover:bg-accent/50 transition-colors duration-150"
                          >
                            {Object.values(row).map((value, j) => (
                              <td
                                key={j}
                                className="px-6 py-4 text-sm whitespace-nowrap"
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* History Sidebar - Right Section */}
          <div className="w-80 overflow-y-auto bg-background shadow-lg">
            <div className="p-6 space-y-8">
              {/* Prompts History */}
              <div>
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-background/80 backdrop-blur-sm py-2">
                  <h2 className="text-lg font-semibold tracking-tight">Prompts History</h2>
                  <button 
                    className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 hover:shadow-sm"
                    title="Clear History"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {savedQueries.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-accent rounded-lg cursor-pointer hover:bg-accent/90 transition-colors duration-200 border border-border"
                      onClick={() => setInput(item.query)}
                    >
                      <p className="text-sm text-foreground mb-2 line-clamp-2">{item.query}</p>
                      <p className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </p>
                    </div>
                  ))}
                  {savedQueries.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No prompts history yet
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Execution History */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Execution History</h2>
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <div className="space-y-3">
                  {[...executionHistory, ...(results ? [{
                    query: output,
                    timestamp: new Date(),
                    metadata: results.metadata
                  }] : [])].map((execution, index) => (
                    <div key={index} className="p-4 bg-accent rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {index === 0 && results ? (
                            <span className="text-primary">Latest Execution</span>
                          ) : (
                            'Previous Execution'
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">{execution.metadata.executionTime}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {execution.query}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-1 bg-background text-foreground rounded-full">
                          Rows: {execution.metadata.rowCount}
                        </span>
                        <span className="px-2 py-1 bg-background text-foreground rounded-full">
                          Affected: {execution.metadata.affectedRows}
                        </span>
                      </div>
                    </div>
                  ))}
                  {executionHistory.length === 0 && !results && (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No execution history yet
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Queries */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Recent Queries</h2>
                </div>
                <div className="space-y-3">
                  {[...(output ? [{
                    query: output,
                    timestamp: new Date(),
                    label: 'Current Query'
                  }] : []), ...savedQueries.slice(0, 3).map(item => ({
                    query: item.generated,
                    timestamp: item.timestamp,
                    label: 'Saved Query'
                  }))].map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-accent rounded-lg cursor-pointer hover:bg-accent/90 transition-colors duration-200 border border-border"
                      onClick={() => setOutput(item.query)}
                    >
                      <p className="text-sm text-foreground mb-2 line-clamp-2">{item.query}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-1 bg-background text-foreground rounded-full">
                          {item.label}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {savedQueries.length === 0 && !output && (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No recent queries
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default QueryBuilder 