import Editor from '@monaco-editor/react';

export const CodeEditor = ({
	value,
	setValue,
}: {
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
	return (
		<Editor
			height={'60vh'}
			theme='vs-dark'
			onMount={() => {}}
			options={{
				minimap: { enabled: false },
				fontSize: 14,
				lineNumbers: 'on',
				scrollBeyondLastLine: false,
				automaticLayout: true,
				tabSize: 2,
			}}
			defaultLanguage='java'
			defaultValue={value}
			onChange={(value) => setValue(value || '')}
		/>
	);
};
