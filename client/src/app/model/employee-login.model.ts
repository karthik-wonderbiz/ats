export interface Page {
    id: number;
    roleId: number;
    roleName: string;
    pageId: number;
    pageTitle: string;
    isActive: boolean;
}

export interface LoginModel {
    email: string;
    password: string;
    roleId: number;
    pageList: Page[];
}

// export LoginModel;
