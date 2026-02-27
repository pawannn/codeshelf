import * as vscode from 'vscode';
import { ShelfProvider } from './ShelfProvider';

export class ShelfDragAndDropController implements vscode.TreeDragAndDropController<any> {

    dropMimeTypes = ['application/vnd.code.tree.bookshelfView'];
    dragMimeTypes = ['application/vnd.code.tree.bookshelfView'];

    constructor(private provider: ShelfProvider) { }

    async handleDrag(
        source: any[],
        dataTransfer: vscode.DataTransfer
    ): Promise<void> {
        dataTransfer.set(
            'application/vnd.code.tree.bookshelfView',
            new vscode.DataTransferItem(source)
        );
    }

    async handleDrop(
        target: any,
        dataTransfer: vscode.DataTransfer
    ): Promise<void> {

        const transferItem = dataTransfer.get(
            'application/vnd.code.tree.bookshelfView'
        );

        if (!transferItem) {
            return;
        }

        const draggedItems = transferItem.value as any[];
        const dragged = draggedItems[0];

        // Only allow project to be dropped
        if (dragged.type !== 'project') {
            return;
        }

        // Only allow drop into section
        if (!target || target.type !== 'section') {
            return;
        }

        this.provider.moveProjectToSection(
            dragged.data,
            target.data
        );
    }
}