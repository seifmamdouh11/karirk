export interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    type: string;
    salary: string;
    company: string;
    companyLogo: string;
    createdAt: Date;
}

export type JobFilter = {
    location?: string;
    category?: string;
    type?: string;
}