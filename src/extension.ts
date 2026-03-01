import * as vscode from 'vscode';
import { ShelfProvider } from './provider/ShelfProvider';
import { ShelfDragAndDropController } from './provider/DragAndDropController';
import path from 'path/win32';

export function activate(context: vscode.ExtensionContext) {
	const provider = new ShelfProvider(context);
	vscode.window.createTreeView('CodeShelfView', {
		treeDataProvider: provider,
		dragAndDropController: new ShelfDragAndDropController(provider)
	});

	const addSection = vscode.commands.registerCommand('CodeShelf.addSection', async () => {
		const name = await vscode.window.showInputBox({
			prompt: 'Enter section name'
		});

		if (name) {
			provider.addSection(name);
		}
	});

	const openProject = vscode.commands.registerCommand('CodeShelf.openProject', (project) => {
		provider.openProject(project);
	});

	const bookmarkWorkSpace = vscode.commands.registerCommand('CodeShelf.bookmarkWorkspace', () => {
		const folders = vscode.workspace.workspaceFolders;
		if (!folders) {
			return;
		}

		const folder = folders[0];

		provider.addProjectToRoot({
			id: Date.now().toString(),
			label: folder.name,
			path: folder.uri.fsPath
		});
	});

	const removeProject = vscode.commands.registerCommand(
		'CodeShelf.removeProject',
		(item) => {
			if (!item) {
				return;
			}

			provider.removeProject(item.data);
		}
	);

	const renameSection = vscode.commands.registerCommand(
		'CodeShelf.renameSection',
		async (item: any) => {
			if (!item?.data) { return; }

			const newName = await vscode.window.showInputBox({
				prompt: "Enter new section name",
				value: item.data.name
			});

			if (!newName) { return; }

			provider.renameSection(item.data.id, newName);
		}
	);

	const deleteSection = vscode.commands.registerCommand(
		'CodeShelf.deleteSection',
		async (item: any) => {
			if (!item?.data) { return; }

			const confirm = await vscode.window.showWarningMessage(
				`Delete section "${item.data.name}" and all its projects?`,
				{ modal: true },
				"Delete"
			);

			if (confirm === "Delete") {
				provider.deleteSection(item.data.id);
			}
		}
	);

	const refreshCommand = vscode.commands.registerCommand(
		'CodeShelf.refresh',
		() => {
			provider.validateProjects();
		}
	);

	const addFromExplorer = vscode.commands.registerCommand(
		'CodeShelf.addFromExplorer',
		(uri: vscode.Uri) => {
			if (!uri) { return; }

			provider.addProjectToRoot({
				id: Date.now().toString(),
				label: path.basename(uri.fsPath),
				path: uri.fsPath
			});
		}
	);

	context.subscriptions.push(
		addSection,
		openProject,
		bookmarkWorkSpace,
		removeProject,
		renameSection,
		deleteSection,
		refreshCommand,
		addFromExplorer
	);
}

export function deactivate() { }
