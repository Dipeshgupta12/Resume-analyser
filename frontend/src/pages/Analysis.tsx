import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Tag,
  Layout,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import ScoreCard from '../components/ScoreCard'
import AnalysisCard, {
  AnalysisList,
  SkillBadges,
  KeywordBadges,
} from '../components/AnalysisCard'
import Loading from '../components/Loading'
import { getResumeAnalysis, getErrorMessage } from '../services/api'
import type { ResumeUploadResponse } from '../types/resume'

export default function Analysis() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [data, setData] = useState<ResumeUploadResponse | null>(
    (location.state as { data?: ResumeUploadResponse })?.data ?? null
  )
  const [loading, setLoading] = useState(!data)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (data || !id) return

    const fetchAnalysis = async () => {
      try {
        const result = await getResumeAnalysis(Number(id))
        setData({
          id: result.id,
          filename: result.filename,
          analysis: result.analysis,
        })
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [id, data])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <Navbar />
        <div className="pt-24">
          <Loading message="Loading analysis results..." />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center px-4 pt-32">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/50">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold text-red-700 dark:text-red-400">
              {error || 'Analysis not found'}
            </h2>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { analysis, filename } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Analyze Another Resume
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-white dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </motion.div>

        <ScoreCard
          overallScore={analysis.overall_score}
          atsScore={analysis.ats_score}
          filename={filename}
        />

        <div className="mt-8 grid gap-6">
          <AnalysisCard title="Summary" icon={FileText} delay={0.1}>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {analysis.summary}
            </p>
          </AnalysisCard>

          <div className="grid gap-6 md:grid-cols-2">
            <AnalysisCard
              title="Strengths"
              icon={CheckCircle2}
              iconColor="text-emerald-500"
              delay={0.2}
            >
              <AnalysisList
                items={analysis.strengths}
                icon={CheckCircle2}
                iconColor="text-emerald-500"
              />
            </AnalysisCard>

            <AnalysisCard
              title="Weaknesses"
              icon={AlertTriangle}
              iconColor="text-amber-500"
              delay={0.3}
            >
              <AnalysisList
                items={analysis.weaknesses}
                icon={AlertTriangle}
                iconColor="text-amber-500"
              />
            </AnalysisCard>
          </div>

          <AnalysisCard title="Missing Skills" icon={Tag} iconColor="text-amber-500" delay={0.4}>
            <SkillBadges skills={analysis.missing_skills} />
          </AnalysisCard>

          {analysis.formatting_issues.length > 0 && (
            <AnalysisCard title="Formatting Issues" icon={Layout} iconColor="text-orange-500" delay={0.45}>
              <AnalysisList
                items={analysis.formatting_issues}
                icon={Layout}
                iconColor="text-orange-500"
              />
            </AnalysisCard>
          )}

          <AnalysisCard title="Recommendations" icon={Lightbulb} iconColor="text-violet-500" delay={0.5}>
            <AnalysisList
              items={analysis.recommendations}
              icon={Lightbulb}
              iconColor="text-violet-500"
            />
          </AnalysisCard>

          <AnalysisCard title="Keyword Suggestions" icon={Tag} iconColor="text-indigo-500" delay={0.6}>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
              ATS-friendly keywords to consider adding to your resume
            </p>
            <KeywordBadges keywords={analysis.keywords} />
          </AnalysisCard>
        </div>
      </div>
    </div>
  )
}
