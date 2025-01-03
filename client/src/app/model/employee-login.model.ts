export interface Page {
    id: number;
    roleId: number;
    roleName: string;
    pageId: number;
    pageTitle: string;
    isActive: boolean;
}

export interface LoginModel{
    id: string,
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    contactNo: string,
    profilePic: string; 
    employeeDetailId: number,
    password:string,
    roleId: number
    pageList:Page[]
}

// export LoginModel;
