import Editor from '@monaco-editor/react';
import { cn } from '@repo/ui/lib/utils';

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
	return (
		<div className={cn('rounded-md border', className)}>
			<Editor
				height='60vh'
				language={language}
				theme='vs-dark'
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
