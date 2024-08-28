interface Page {
    id: number;
    roleId: number;
    roleName: string;
    pageId: number;
    pageTitle: string;
    isActive: boolean;
}

interface LoginModel {
    email: string;
    password: string;
    roleId: number;
    pageList: Page[];
}

export default LoginModel;
