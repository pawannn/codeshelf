import * as vscode from 'vscode';
import { ShelfState, Section, Project } from '../models/types';

export class ShelfProvider implements vscode.TreeDataProvider<ShelfItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<ShelfItem | undefined | null | void> =
        new vscode.EventEmitter<ShelfItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ShelfItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    private state: ShelfState;

    constructor(private context: vscode.ExtensionContext) {
        this.state = this.context.globalState.get<ShelfState>('bookshelf') || {
            sections: [],
            rootProjects: []
        };
    }

    refresh() {
        this.context.globalState.update('bookshelf', this.state);
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ShelfItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ShelfItem): vscode.ProviderResult<ShelfItem[]> {

        if (!element) {
            const sectionItems = this.state.sections.map(
                s => new ShelfItem(s.name, 'section', s)
            );

            const rootItems = this.state.rootProjects.map(
                p => new ShelfItem(p.label, 'project', p)
            );

            return [...sectionItems, ...rootItems];
        }

        if (element.type === 'section') {
            const section = element.data as Section;

            return section.projects.map(
                p => new ShelfItem(p.label, 'project', p)
            );
        }

        return [];
    }

    addSection(name: string) {
        this.state.sections.push({
            id: Date.now().toString(),
            name,
            projects: []
        });
        this.refresh();
    }

    addProjectToRoot(project: Project) {
        if (!project?.path) {
            return;
        }

        const existsInRoot = this.state.rootProjects.some(
            p => p.path === project.path
        );

        const existsInSections = this.state.sections.some(section =>
            section.projects.some(p => p.path === project.path)
        );

        if (existsInRoot || existsInSections) {
            vscode.window.showInformationMessage(
                "Project already exists in Bookshelf."
            );
            return;
        }

        this.state.rootProjects.push(project);
        this.refresh();
    }

    openProject(project: Project) {
        vscode.commands.executeCommand(
            'vscode.openFolder',
            vscode.Uri.file(project.path),
            true
        );
    }

    removeProject(project: Project) {
        if (!project?.path) {
            return;
        }

        this.state.rootProjects = this.state.rootProjects.filter(
            p => p.path !== project.path
        );

        this.state.sections.forEach(section => {
            section.projects = section.projects.filter(
                p => p.path !== project.path
            );
        });

        this.refresh();
    }

    moveProjectToSection(project: any, section: any) {
        if (!project?.path) {
            return;
        }

        this.state.rootProjects = this.state.rootProjects.filter(
            p => p.path !== project.path
        );

        this.state.sections.forEach(s => {
            s.projects = s.projects.filter(
                p => p.path !== project.path
            );
        });

        const targetSection = this.state.sections.find(
            s => s.id === section.id
        );

        if (targetSection) {
            targetSection.projects.push(project);
        }

        this.refresh();
    }

    renameSection(sectionId: string, newName: string) {
        const section = this.state.sections.find(
            s => s.id === sectionId
        );

        if (!section) { return; }

        section.name = newName;
        this.refresh();
    }

    deleteSection(sectionId: string) {
        this.state.sections = this.state.sections.filter(
            s => s.id !== sectionId
        );

        this.refresh();
    }
}

class ShelfItem extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly type: 'section' | 'project',
        public readonly data: any
    ) {
        super(
            label,
            type === 'section'
                ? vscode.TreeItemCollapsibleState.Collapsed
                : vscode.TreeItemCollapsibleState.None
        );

        if (type === 'project') {
            this.command = {
                command: 'bookshelf.openProject',
                title: 'Open Project',
                arguments: [data]
            };
        }

        this.contextValue = type;
    }
}