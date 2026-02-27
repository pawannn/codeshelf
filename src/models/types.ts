export interface Project {
    id: string;
    label: string;
    path: string;
}

export interface Section {
    id: string;
    name: string;
    projects: Project[];
}

export interface ShelfState {
    sections: Section[];
    rootProjects: Project[];
}