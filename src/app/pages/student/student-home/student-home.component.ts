import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentDashboardService } from '../../../core/services/Student_dashboard/student_dashboard.service';
import { StudentDashboardData } from '../../../shared/interfaces/Dashboards/Student';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class StudentHome implements OnInit {
  dashboardData: StudentDashboardData | null = null;
  upcomingExams: any[] = [];
  loading = true;
  error: string | null = null;
  showTooltip: number | null = null;
  usingMockData = false; // Flag to track if we're using mock data

  // Default empty data to prevent null errors
  private defaultDashboardData: StudentDashboardData = {
    examsTaken: 0,
    averageScore: 0,
    bestScore: 0,
    upcomingExams: 0,
    performance: [],
    scoreTrend: [],
    recentResults: [],
    gradeDistribution: { a: 0, b: 0, c: 0, d: 0 },
  };

  constructor(private dashboardService: StudentDashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;
    this.usingMockData = false;

    this.dashboardService.getStudentDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;

        // Check if we're using mock data by comparing with mock data
        // You can implement a more sophisticated check if needed
        console.log('Dashboard data loaded:', data);
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.error = 'Failed to load dashboard data. Please try again.';
        this.dashboardData = this.defaultDashboardData;
        this.loading = false;
      },
    });

    // Load upcoming exams
    this.dashboardService.getUpcomingExams().subscribe({
      next: (data) => (this.upcomingExams = data),
      error: (err) => {
        console.error('Error loading upcoming exams:', err);
        this.upcomingExams = [];
      },
    });
  }

  // Safe getter for template - returns non-nullable data
  get safeDashboardData(): StudentDashboardData {
    return this.dashboardData || this.defaultDashboardData;
  }

  getScoreTrendPoints(): { x: number; y: number }[] {
    const data = this.safeDashboardData.scoreTrend;
    if (!data.length) return [];

    const width = 600;
    const height = 200;
    const padding = 30;

    return data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - (point.score / 100) * (height - 2 * padding);
      return { x, y };
    });
  }

  getScoreTrendPath(): string {
    const points = this.getScoreTrendPoints();
    if (points.length === 0) return '';
    return points.reduce((path, point, index) => {
      return index === 0
        ? `M ${point.x},${point.y}`
        : `${path} L ${point.x},${point.y}`;
    }, '');
  }

  getTotalGrades(): number {
    const g = this.safeDashboardData.gradeDistribution;
    return g.a + g.b + g.c + g.d;
  }

  retry(): void {
    this.loadDashboard();
  }
}
