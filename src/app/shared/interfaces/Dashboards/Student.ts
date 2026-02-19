export interface StudentDashboardData {
  examsTaken: number;
  averageScore: number;
  bestScore: number;
  upcomingExams: number;
  performance: PerformanceBySubject[];
  scoreTrend: ScoreTrend[];
  recentResults: RecentResult[];
  gradeDistribution: GradeDistribution;
}

export interface PerformanceBySubject {
  subject: string;
  score: number;
}

export interface ScoreTrend {
  month: string;
  score: number;
}

export interface RecentResult {
  subject: string;
  date: string;
  score: number;
  total: number;
}

export interface GradeDistribution {
  a: number;
  b: number;
  c: number;
  d: number;
}
