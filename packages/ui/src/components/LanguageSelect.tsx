import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from './../lib/utils';
import { Button } from './Button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@repo/ui/components/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@repo/ui/components/Popover';
import { LanguageMapping } from '@repo/language/LanguageMapping';

export function LanguageSelect({
	selectedLanguage,
	setSelectedLanguage,
}: {
	selectedLanguage: {
		value: string;
		label: string;
		monaco: string;
		judge0: number;
	} | null;
	setSelectedLanguage: React.Dispatch<
		React.SetStateAction<{
			value: string;
			label: string;
			monaco: string;
			judge0: number;
		} | null>
	>;
}) {
	const [open, setOpen] = React.useState(false);
	const languages = Object.entries(LanguageMapping).map(([key, lang]) => ({
		value: key,
		label: lang.name,
		monaco: lang.monaco,
		judge0: lang.judge0,
	}));

	const handleSelect = (lang: (typeof languages)[0]) => {
		setSelectedLanguage(lang);
		setOpen(false);
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-[200px] justify-between'
				>
					{selectedLanguage
						? selectedLanguage.label
						: 'Select Language...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandList>
						<CommandEmpty>No language found.</CommandEmpty>
						<CommandGroup>
							{languages.map((lang) => (
								<CommandItem
									key={lang.value}
									onSelect={() => handleSelect(lang)}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											selectedLanguage?.value ===
												lang.value
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
									{lang.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
