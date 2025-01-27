import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { languageMapping } from '@repo/language/LanguageMapping';

export const CodeEditor = () => {
	const [value, setValue] = useState<string>('// some comment');

	return (
		<Editor
			height={'60vh'}
			theme='vs-dark'
			onMount={() => {}}
			options={{
				fontSize: 14,
				scrollBeyondLastLine: false,
			}}
			defaultLanguage='javascript'
			defaultValue='// some comment'
		/>
	);
};
