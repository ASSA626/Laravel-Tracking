// Public types (for user and admin role)
export interface User {
    id?: number,
    fullname?: string,
    username?: string,
    mobile?: string,
    national_code?: number,
    image?: string,
    father_name?: string
    address?: string
    zip?: number
    personally_number?: number
    bimeh_number?: number
    home_phone?: number
    mobile_friend?: number
    user_activity?: number
    days_function?: number
    bimeh?: number
    password?: string
    role?: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
}

export type PaginatedData<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };

    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;

        links: {
            url: null | string;
            label: string;
            active: boolean;
        }[];
    }
}

// Custom types (for user role)
export interface HeaderBoxProps {
    subText: string
}

export interface HomeTime {
    id?: number,
    user_id?: number,
    user_work_home?: number,
    daily_time?: string,
    left_time?: number
}

export interface Clock {
    id: number,
    user_id: number,
    start_time: string,
    user_work: number,
    daily_time: string,
    left_time: string
}

export interface Project {
    title: string
}

export interface Duty {
    id: number,
    user_id: number,
    date_of_request: string,
    of_date: string,
    to_date: string,
    project: string,
    place: string,
    transporter: string,
    description: string,
    status: string
}

export interface MissionClock {
    id?: number,
    user_id?: number,
    start_time?: string,
    daily_time?: string | null,
    left_time?: string | null
}

// Custom types (for admin role)
export interface AdminUsers {
    id: number,
    fullname: string,
    mobile: string,
    national_code?: string,
    image?: string,
    father_name?: string,
    address?: string,
    zip?: number,
    personally_number?: number,
    bimeh_number?: number,
    home_phone?: number,
    mobile_friend?: number,
    user_activity?: number,
    days_function?: number,
    bimeh?: number,
    password?: string,
    role?: string
}

export interface AdminDuties {
    id?: string,
    date_of_request?: string,
    of_date?: string,
    to_date?: string,
    project?: string,
    place?: string,
    transporter?: string,
    description?: string,
    status: string
}

export interface AdminSalaries {
    title?: string,
    value?: string,
    count?: number,
    complete_value?: string,
    description?: string,
    created_at?: string,
    status?: string
}

export interface AdminProjects {
    title?: string,
    company_name?: string
}

export interface AdminVacations {
    of_time?: string,
    to_time?: string,
    type?: string,
    caption?: string
}

export interface AdminClocks {
    start_time: string,
    user_work: string,
    daily_time: string,
    left_time: string
}

export interface AdminHomeworks {

}

export interface SummaryItem {

}

export interface AdminDutiesClock {

}
