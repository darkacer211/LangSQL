import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Code2,
  Database,
  Zap,
  Users,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

const About = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const features = [
    {
      name: 'AI-Powered SQL Generation',
      description: 'Generate complex SQL queries from natural language descriptions using advanced AI models.',
      icon: Code2,
    },
    {
      name: 'Schema Design',
      description: 'Create and optimize database schemas with intelligent suggestions and best practices.',
      icon: Database,
    },
    {
      name: 'Query Translation',
      description: 'Translate SQL queries between different database dialects automatically.',
      icon: Zap,
    },
    {
      name: 'Performance Analysis',
      description: 'Get detailed insights into query performance and optimization suggestions.',
      icon: Zap,
    },
  ]

  const faqs = [
    {
      question: 'What is SQLMind?',
      answer:
        'SQLMind is an AI-powered SQL development platform that helps developers write, optimize, and manage SQL queries more efficiently. It combines advanced AI models with best practices to streamline database development.',
    },
    {
      question: 'How does the AI query generation work?',
      answer:
        'Our AI models analyze your natural language description of what you want to achieve, understand the context and requirements, and generate appropriate SQL queries. The system considers best practices, performance implications, and database-specific features.',
    },
    {
      question: 'Which database systems are supported?',
      answer:
        'SQLMind supports major database systems including MySQL, PostgreSQL, SQLite, SQL Server, and Oracle. We continuously add support for more databases based on user demand.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes, we take security seriously. All queries and data are encrypted in transit and at rest. We never store sensitive database credentials or actual query results.',
    },
  ]

  const gettingStarted = [
    {
      title: 'Create an Account',
      description: 'Sign up for a free account to access all features.',
    },
    {
      title: 'Connect Your Database',
      description: 'Add your database connection details securely.',
    },
    {
      title: 'Start Building',
      description: 'Use our AI-powered tools to write and optimize queries.',
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0A0A0B] text-white p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">About SQLMind</h1>
            <p className="text-gray-400 text-lg">
              Empowering developers with AI-powered SQL development tools to write better queries faster.
            </p>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card"
                >
                  <feature.icon className="h-12 w-12 text-[#00E5FF] mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gettingStarted.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#00E5FF] text-black rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <h3 className="ml-3 text-lg font-semibold">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full text-left flex justify-between items-center"
                  >
                    <span className="text-lg font-semibold">
                      {faq.question}
                    </span>
                    {openFaqIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {openFaqIndex === index && (
                    <div className="mt-4">
                      <p className="text-gray-400">{faq.answer}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Documentation Section */}
          <div className="mb-16">
            <div className="card">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-[#00E5FF] mr-3" />
                <h2 className="text-2xl font-bold">Documentation</h2>
              </div>
              <p className="text-gray-400 mb-6">
                Explore our comprehensive documentation to learn more about SQLMind's features and
                capabilities.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-[#00E5FF] hover:text-[#00E5FF]/80"
              >
                View Documentation
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
            <div className="flex justify-center space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-[#00E5FF] transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#00E5FF] transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#00E5FF] transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default About 