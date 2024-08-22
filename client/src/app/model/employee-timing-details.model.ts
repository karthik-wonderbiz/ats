// app/models/employee-timing-details.model.ts
export interface EmployeeTimingDetails {
    id: number;
    Employee: string;
    Entry: {
        Early: string;
        Late: string;
    };
    Exit: {
        Early: string;
        Late: string;
    };
    NetHours: string;
    Shift: string;
    TodaysInOut: string[];
}
