import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const SNIPPETS_FILE = 'snippets.json';

export function activate(context: vscode.ExtensionContext) {
    const saveSnippetCommand = vscode.commands.registerCommand('snippetOrganizer.saveSnippet', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selectedText = editor.document.getText(editor.selection);
        if (!selectedText) {
            vscode.window.showInformationMessage("Выделите текст для сохранения.");
            return;
        }

        const snippetName = await vscode.window.showInputBox({ prompt: "Введите название сниппета" });
        if (!snippetName) return;

        saveSnippet(snippetName, selectedText);
    });

    const insertSnippetCommand = vscode.commands.registerCommand('snippetOrganizer.insertSnippet', async () => {
        const snippets = loadSnippets();
        const snippetNames = Object.keys(snippets);

        const snippetName = await vscode.window.showQuickPick(snippetNames, { placeHolder: "Выберите сниппет для вставки" });
        if (!snippetName) return;

        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.start, snippets[snippetName]);
        });
    });

    context.subscriptions.push(saveSnippetCommand, insertSnippetCommand);
}

function saveSnippet(name: string, content: string) {
    const filePath = path.join(vscode.workspace.rootPath || '', SNIPPETS_FILE);
    const snippets = loadSnippets(filePath);

    snippets[name] = content;
    fs.writeFileSync(filePath, JSON.stringify(snippets, null, 2), 'utf-8');
    vscode.window.showInformationMessage(`Сниппет "${name}" сохранён.`);
}

function loadSnippets(filePath: string = path.join(vscode.workspace.rootPath || '', SNIPPETS_FILE)) {
    if (!fs.existsSync(filePath)) return {};
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

export function deactivate() {}
