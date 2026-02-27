import * as vscode from 'vscode';
import { ShelfProvider } from './provider/ShelfProvider';
import { ShelfDragAndDropController } from './provider/DragAndDropController';

export function activate(context: vscode.ExtensionContext) {
	const provider = new ShelfProvider(context);
	vscode.window.createTreeView('bookshelfView', {
		treeDataProvider: provider,
		dragAndDropController: new ShelfDragAndDropController(provider)
	});

	const addSection = vscode.commands.registerCommand('bookshelf.addSection', async () => {
		const name = await vscode.window.showInputBox({
			prompt: 'Enter section name'
		});

		if (name) {
			provider.addSection(name);
		}
	});

	const openProject = vscode.commands.registerCommand('bookshelf.openProject', (project) => {
		provider.openProject(project);
	});

	const bookmarkWorkSpace = vscode.commands.registerCommand('bookshelf.bookmarkWorkspace', () => {
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
		'bookshelf.removeProject',
		(item) => {
			if (!item) {
				return;
			}

			provider.removeProject(item.data);
		}
	);

	const renameSection = vscode.commands.registerCommand(
		'bookshelf.renameSection',
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
		'bookshelf.deleteSection',
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

	context.subscriptions.push(
		addSection,
		openProject,
		bookmarkWorkSpace,
		removeProject,
		renameSection,
		deleteSection
	);
}

export function deactivate() { }
