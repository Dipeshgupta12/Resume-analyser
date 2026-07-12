import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'

interface ScoreCardProps {
  overallScore: number
  atsScore: number
  filename: string
}

function CircularProgress({
  score,
  label,
  color,
  delay,
}: {
  score: number
  label: string
  color: string
  delay: number
}) {
  const [animated, setAnimated] = useState(0)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animated / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), delay)
    return () => clearTimeout(timer)
  }, [score, delay])

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200 dark:text-slate-700"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: delay / 1000 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{animated}</span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</p>
    </div>
  )
}

export default function ScoreCard({ overallScore, atsScore, filename }: ScoreCardProps) {
  const improvement = Math.max(0, 100 - overallScore)
  const potentialScore = Math.min(100, overallScore + Math.round(improvement * 0.6))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/20 bg-white/60 p-8 shadow-xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/60"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Resume Analysis</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{filename}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
        <CircularProgress score={overallScore} label="Overall Score" color="#8b5cf6" delay={200} />
        <CircularProgress score={atsScore} label="ATS Score" color="#6366f1" delay={400} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-emerald-700 dark:text-emerald-400"
      >
        <TrendingUp className="h-5 w-5" />
        <span className="text-sm font-medium">
          Potential score with improvements: <strong>{potentialScore}%</strong>
          {improvement > 0 && (
            <span className="ml-1 text-emerald-600/80">(+{potentialScore - overallScore}% possible)</span>
          )}
        </span>
      </motion.div>
    </motion.div>
  )
}
