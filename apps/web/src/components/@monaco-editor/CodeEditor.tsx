import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { languageMapping } from '@repo/language/LanguageMapping';

export const CodeEditor = () => {
	const [value, setValue] = useState<string>('// some comment');
	const editorRef = useRef(null);

	console.log('ed', languageMapping);

	const handleEditorDidMount = (editor) => {
		editorRef.current = editor;
		editor.focus();
	};

	return (
		<Editor
			height='75vh'
			theme='vs-dark'
			defaultLanguage='javascript'
			onMount={handleEditorDidMount}
			defaultValue={value}
			onChange={(value) => value !== undefined && setValue(value)}
		/>
	);
};
