import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-xl dark:bg-slate-950/70"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Resume<span className="text-violet-500">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-slate-200/60 bg-white/50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <Link
            to="/#upload"
            className="hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40 sm:inline-block"
          >
            Analyze Resume
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
