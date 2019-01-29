export class User {
    name: string;
    lastname: string;
    username: string;
    isActive: Activated;
    role: UserRole;
    password: string;
    id: string;
}

/* SHOULD BE CHANGED AS LOWERCASE */
export class Profile {
    name: string;
    lastname: string;
    username: string;
    role: number;
    roleName: string;
    reports: number;
    totalReports: number;
}


export enum Activated {
    No,
    Yes,
    All
}


export enum UserRole {
    Admin,
    Manager,
    User
}
