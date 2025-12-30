import Editor from '@monaco-editor/react';
import { cn } from '@repo/ui/lib/utils';
import { useTheme } from 'next-themes';

interface CodeEditorProps {
	value: string;
	onChange: (value: string | undefined) => void;
	language?: string;
	className?: string;
}

const CodeEditor = ({
	value,
	onChange,
	language = 'javascript',
	className,
}: CodeEditorProps) => {
	const { theme } = useTheme();
	const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs-light';

	return (
		<div className={cn('rounded-md border h-full', className)}>
			<Editor
				height='100%'
				language={language}
				theme={monacoTheme}
				value={value}
				onChange={onChange}
				options={{
					minimap: { enabled: false },
					fontSize: 14,
					lineNumbers: 'on',
					roundedSelection: false,
					scrollBeyondLastLine: false,
					readOnly: false,
					automaticLayout: true,
				}}
			/>
		</div>
	);
};

export default CodeEditor;
