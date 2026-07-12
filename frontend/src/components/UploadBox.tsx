import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'

interface UploadBoxProps {
  onUpload: (file: File) => void
  isLoading?: boolean
  progress?: number
  error?: string | null
}

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const ALLOWED_EXTENSIONS = ['.pdf', '.docx']
const MAX_SIZE_MB = 5

export default function UploadBox({ onUpload, isLoading, progress = 0, error }: UploadBoxProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a PDF or DOCX file.'
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`
    }
    return null
  }

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setLocalError(validationError)
      return
    }
    setLocalError(null)
    setSelectedFile(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setLocalError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleAnalyze = () => {
    if (selectedFile) onUpload(selectedFile)
  }

  const displayError = error || localError

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        animate={{ scale: dragActive ? 1.02 : 1 }}
        className={`relative rounded-2xl border-2 border-dashed p-8 transition-all backdrop-blur-sm ${
          dragActive
            ? 'border-violet-500 bg-violet-500/10'
            : 'border-slate-300/60 bg-white/40 dark:border-slate-600/60 dark:bg-slate-800/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleChange}
          className="hidden"
          id="resume-upload"
          disabled={isLoading}
        />

        {!selectedFile ? (
          <label htmlFor="resume-upload" className="flex cursor-pointer flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
              <Upload className="h-8 w-8 text-violet-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                Drag & drop your resume here
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                or click to browse — PDF or DOCX, max {MAX_SIZE_MB}MB
              </p>
            </div>
          </label>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
                <FileText className="h-6 w-6 text-violet-500" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900 dark:text-white">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            {!isLoading && (
              <button
                onClick={removeFile}
                className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-700"
                aria-label="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {isLoading && progress > 0 && (
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-center text-sm text-slate-500">{progress}% uploaded</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {displayError}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedFile && !isLoading && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleAnalyze}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:shadow-violet-500/50"
        >
          Analyze Resume with AI
        </motion.button>
      )}
    </div>
  )
}
