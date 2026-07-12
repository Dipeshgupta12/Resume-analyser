import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Brain,
  Target,
  Search,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  Sparkles,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import UploadBox from '../components/UploadBox'
import Loading from '../components/Loading'
import { uploadResume, getErrorMessage } from '../services/api'

const features = [
  {
    icon: Brain,
    title: 'Analyze Your Resume With AI',
    description:
      'Get expert-level feedback powered by advanced LLM technology. Our AI acts as your personal career coach.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Target,
    title: 'Get ATS Score',
    description:
      'Understand how Applicant Tracking Systems will rank your resume and optimize for better visibility.',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    icon: Search,
    title: 'Find Missing Skills',
    description:
      'Discover skills gaps that might be holding you back and get recommendations to strengthen your profile.',
    color: 'from-cyan-500 to-teal-600',
  },
  {
    icon: TrendingUp,
    title: 'Improve Your Career Profile',
    description:
      'Receive actionable suggestions to enhance your resume and increase your chances of getting shortlisted.',
    color: 'from-emerald-500 to-green-600',
  },
]

const stats = [
  { label: 'Analysis Time', value: '< 30s' },
  { label: 'Score Metrics', value: '2+' },
  { label: 'AI Insights', value: '10+' },
]

export default function Home() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)
    setProgress(0)

    try {
      const result = await uploadResume(file, setProgress)
      navigate(`/analysis/${result.id}`, { state: { data: result } })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
              AI-Powered Resume Analysis
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
              Land Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                AI Insights
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Upload your resume and get instant, detailed feedback on ATS compatibility,
              missing skills, and actionable improvements — powered by Groq AI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-8"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Upload Your Resume
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              PDF or DOCX — get your analysis in seconds
            </p>
          </motion.div>

          {isLoading ? (
            <Loading />
          ) : (
            <UploadBox
              onUpload={handleUpload}
              isLoading={isLoading}
              progress={progress}
              error={error}
            />
          )}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Everything You Need to Stand Out
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Comprehensive AI analysis to optimize your resume for success
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-900/60"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/20 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-8 backdrop-blur-xl sm:p-12 dark:border-slate-700/50"
          >
            <h2 className="mb-8 text-center text-3xl font-bold text-slate-900 dark:text-white">
              How AI Analysis Works
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { icon: Zap, step: '1', title: 'Upload', desc: 'Drop your PDF or DOCX resume' },
                { icon: BarChart3, step: '2', title: 'Analyze', desc: 'AI evaluates ATS score & content' },
                { icon: Shield, step: '3', title: 'Improve', desc: 'Get actionable recommendations' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15">
                    <item.icon className="h-7 w-7 text-violet-500" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
                    Step {item.step}
                  </span>
                  <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 px-4 py-8 dark:border-slate-800">
        <div className="mx-auto max-w-7xl text-center text-sm text-slate-500">
          <p>ResumeAI — AI-powered resume analysis. No account required.</p>
        </div>
      </footer>
    </div>
  )
}
