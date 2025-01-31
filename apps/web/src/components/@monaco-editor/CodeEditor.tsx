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
				fontSize: 14,
				scrollBeyondLastLine: false,
			}}
			defaultLanguage='java'
			defaultValue={value}
			onChange={(value) => setValue(value || '')}
		/>
	);
};
