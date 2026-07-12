import axios from 'axios'
import type { ResumeAnalysisResponse, ResumeUploadResponse } from '../types/resume'

// Use relative URLs in production (same domain API) or absolute URL via VITE_API_URL for local dev.
const API_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000,
})

export async function uploadResume(
  file: File,
  onProgress?: (percent: number) => void
): Promise<ResumeUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post<ResumeUploadResponse>('/api/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded * 100) / event.total))
      }
    },
  })

  return data
}

export async function getResumeAnalysis(id: number): Promise<ResumeAnalysisResponse> {
  const { data } = await api.get<ResumeAnalysisResponse>(`/api/resume/${id}`)
  return data
}

export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await api.get<{ status: string }>('/api/health')
  return data
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return detail.map((d) => d.msg).join(', ')
    return error.message || 'An unexpected error occurred.'
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred.'
}
