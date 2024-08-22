export interface AttendanceLogModel{
    total: number;
    present: number;
    wfh:number;
    absent: number;

    lastCheckInTime: string | number | Date;
    lastCheckOutTime: string | number | Date;

    userId: number;
    inOutTime: string;
    checkType: string;

    startDate: string;
    endDate: string;

    attendanceLogTime: string;

    totalHours: string;

    profilePic: string;
    fullName: string;
    firstName: string;
    lastName: string;

    status: string,
    inTime: string
}