export interface EmployeeAttendance {
  id: number;
  Employee: string;
  FirstIn: string;
  LastOut: string;
  DailyHours: string;
  WeeklyHours: string;
  MonthlyHours: string;
  QuarterlyHours: string;
  YearlyHours: string;
  AllTimeHours: string;
  TodaysInOut: string[];
}
