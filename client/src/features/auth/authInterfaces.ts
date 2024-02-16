export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    isAdmin: boolean;
    createdAt: Date;
}

export interface AuthUser {
    _id: string;
    fullName: string;
    email: string;
    isAdmin: boolean;
    token: string;
}

export interface AuthState {
    user: AuthUser | null;
    adminUsers: IUser[];
    loadingAuth: boolean;
    loadingAccountAuth: boolean;
    loadingAuthAdminUsers: boolean;
    successAuth: boolean;
    errorAuth: boolean;
    messageAuth: string;
}