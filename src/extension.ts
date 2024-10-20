import * as vscode from 'vscode';
import { todoTemplate } from './template';

export class SimpleViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.getWebviewContent();
  }

  private getWebviewContent() {
    return todoTemplate;
  }
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Todo Widget is Active !');

	const viewProvider = new SimpleViewProvider(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('widget', viewProvider) // The ID should match the one in package.json
	);
  
}