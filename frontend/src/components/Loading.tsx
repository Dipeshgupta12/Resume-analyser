import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  message?: string
}

export default function Loading({ message = 'Analyzing your resume with AI...' }: LoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-6 py-20"
    >
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">{message}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This may take 10–30 seconds depending on resume length
        </p>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-violet-500"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
