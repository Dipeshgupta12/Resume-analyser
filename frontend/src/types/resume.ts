export interface AnalysisResult {
  overall_score: number
  ats_score: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  missing_skills: string[]
  formatting_issues: string[]
  recommendations: string[]
  keywords: string[]
}

export interface ResumeUploadResponse {
  id: number
  filename: string
  analysis: AnalysisResult
}

export interface ResumeAnalysisResponse {
  id: number
  filename: string
  file_type: string
  uploaded_at: string
  analysis: AnalysisResult
}
