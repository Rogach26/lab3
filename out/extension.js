"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const SNIPPETS_FILE = 'snippets.json';
function activate(context) {
    const saveSnippetCommand = vscode.commands.registerCommand('snippetOrganizer.saveSnippet', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        const selectedText = editor.document.getText(editor.selection);
        if (!selectedText) {
            vscode.window.showInformationMessage("Выделите текст для сохранения.");
            return;
        }
        const snippetName = await vscode.window.showInputBox({ prompt: "Введите название сниппета" });
        if (!snippetName)
            return;
        saveSnippet(snippetName, selectedText);
    });
    const insertSnippetCommand = vscode.commands.registerCommand('snippetOrganizer.insertSnippet', async () => {
        const snippets = loadSnippets();
        const snippetNames = Object.keys(snippets);
        const snippetName = await vscode.window.showQuickPick(snippetNames, { placeHolder: "Выберите сниппет для вставки" });
        if (!snippetName)
            return;
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.start, snippets[snippetName]);
        });
    });
    context.subscriptions.push(saveSnippetCommand, insertSnippetCommand);
}
function saveSnippet(name, content) {
    const filePath = path.join(vscode.workspace.rootPath || '', SNIPPETS_FILE);
    const snippets = loadSnippets(filePath);
    snippets[name] = content;
    fs.writeFileSync(filePath, JSON.stringify(snippets, null, 2), 'utf-8');
    vscode.window.showInformationMessage(`Сниппет "${name}" сохранён.`);
}
function loadSnippets(filePath = path.join(vscode.workspace.rootPath || '', SNIPPETS_FILE)) {
    if (!fs.existsSync(filePath))
        return {};
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map