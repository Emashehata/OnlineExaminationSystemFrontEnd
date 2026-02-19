import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { StudentDashboardData } from '../../../shared/interfaces/Dashboards/Student';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentDashboardService {
  private baseUrl = environment.baseURL;

  private mockDashboardData: StudentDashboardData = {
    examsTaken: 13,
    averageScore: 80,
    bestScore: 96,
    upcomingExams: 3,
    performance: [
      { subject: 'Math', score: 92 },
      { subject: 'Physics', score: 78 },
      { subject: 'Chemistry', score: 85 },
      { subject: 'Biology', score: 88 },
      { subject: 'English', score: 76 },
      { subject: 'History', score: 82 },
    ],
    scoreTrend: [
      { month: 'Sep', score: 72 },
      { month: 'Oct', score: 78 },
      { month: 'Nov', score: 82 },
      { month: 'Dec', score: 79 },
      { month: 'Jan', score: 88 },
      { month: 'Feb', score: 85 },
    ],
    recentResults: [
      { subject: 'English Literature', date: 'Feb 1', score: 88, total: 100 },
      { subject: 'World History', date: 'Jan 28', score: 76, total: 100 },
      { subject: 'Linear Algebra', date: 'Jan 22', score: 92, total: 100 },
    ],
    gradeDistribution: {
      a: 4,
      b: 6,
      c: 2,
      d: 1,
    },
  };

  private mockUpcomingExams = [
    {
      subject: 'Advanced Mathematics',
      date: 'Feb 12, 2026',
      time: '10:00 AM',
      duration: '2h',
    },
    {
      subject: 'Physics Mechanics',
      date: 'Feb 15, 2026',
      time: '2:00 PM',
      duration: '1.5h',
    },
    {
      subject: 'Organic Chemistry',
      date: 'Feb 20, 2026',
      time: '9:00 AM',
      duration: '2h',
    },
  ];

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private hasRealData(response: StudentDashboardData): boolean {
    // Only check if this is a real API response (not an error)
    // We want to show real data even if it's zeros
    return true; // Always treat as real data if we get a successful response
  }

  private ensureValidStructure(
    response: StudentDashboardData,
  ): StudentDashboardData {
    // Ensure all required fields exist, but preserve actual values
    return {
      examsTaken: response.examsTaken ?? 0,
      averageScore: response.averageScore ?? 0,
      bestScore: response.bestScore ?? 0,
      upcomingExams: response.upcomingExams ?? 0,
      performance: response.performance ?? [],
      scoreTrend: response.scoreTrend ?? [],
      recentResults: response.recentResults ?? [],
      gradeDistribution: response.gradeDistribution ?? {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
      },
    };
  }

  getStudentDashboard(): Observable<StudentDashboardData> {
    // Check if we're in development mode and want to force mock data
    const useMockData = false; // Set to true to force mock data for testing

    if (useMockData) {
      console.log('🧪 Using mock data (development mode)');
      return of(this.mockDashboardData);
    }

    return this.http
      .get<StudentDashboardData>(`${this.baseUrl}student-dashboard`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          console.log('✅ API Response received:', response);

          // Always return the real API response, even if it's empty
          // Just ensure it has the correct structure
          const validData = this.ensureValidStructure(response);
          console.log('📊 Showing REAL API data:', validData);
          return validData;
        }),
        catchError((error) => {
          console.error('❌ API failed:', error);

          // Handle different error types
          if (error.status === 401) {
            console.warn('🔐 Authentication failed - check your token');
          } else if (error.status === 404) {
            console.warn('🔍 API endpoint not found - check the URL');
          } else if (error.status === 0) {
            console.warn('🌐 Network error - API might be down or CORS issue');
          }

          // Only use mock data when API fails completely
          console.log('📊 Using MOCK data due to API failure');
          return of(this.mockDashboardData);
        }),
      );
  }

  getUpcomingExams(): Observable<any[]> {
    // You can also try to fetch real upcoming exams here
    return of(this.mockUpcomingExams);
  }

  refreshDashboard(): Observable<StudentDashboardData> {
    return this.getStudentDashboard();
  }
}
