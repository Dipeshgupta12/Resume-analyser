import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface AnalysisCardProps {
  title: string
  icon: LucideIcon
  iconColor?: string
  children: React.ReactNode
  delay?: number
}

export default function AnalysisCard({
  title,
  icon: Icon,
  iconColor = 'text-violet-500',
  children,
  delay = 0,
}: AnalysisCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/60"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}

interface ListItemProps {
  items: string[]
  icon?: LucideIcon
  iconColor?: string
}

export function AnalysisList({ items, icon: Icon, iconColor = 'text-violet-500' }: ListItemProps) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No items to display.</p>
  }

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
        >
          {Icon && <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />}
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  )
}

export function SkillBadges({ skills }: { skills: string[] }) {
  if (skills.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No missing skills identified.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/50 dark:text-amber-300"
        >
          {skill}
        </motion.span>
      ))}
    </div>
  )
}

export function KeywordBadges({ keywords }: { keywords: string[] }) {
  if (keywords.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No keyword suggestions available.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
          className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800 dark:border-indigo-800/50 dark:bg-indigo-950/50 dark:text-indigo-300"
        >
          {keyword}
        </motion.span>
      ))}
    </div>
  )
}
