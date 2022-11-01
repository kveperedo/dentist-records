import { DetailedHTMLProps, HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface TableContainerProps extends DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
	children: React.ReactNode;
}

export const TableContainer = ({ children, className, ...props }: TableContainerProps) => {
	return (
		<table className={twMerge('h-full w-full table-auto border-collapse bg-white shadow-sm', className)} {...props}>
			{children}
		</table>
	);
};

interface TableHeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement> {
	children: React.ReactNode;
}

export const TableHeader = ({ children, className, ...props }: TableHeaderProps) => {
	return (
		<thead
			className={twMerge(
				`sticky top-0 z-10 table-header-group 
            border-separate border-b-2 border-primary-500 text-primary-700`,
				className
			)}
			{...props}
		>
			{children}
		</thead>
	);
};

interface TableHeaderCellProps
	extends DetailedHTMLProps<ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement> {
	children: React.ReactNode;
}

export const TableHeaderCell = ({ children, className, ...props }: TableHeaderCellProps) => {
	return (
		<th className={twMerge('bg-primary-200 p-4 py-6 font-semibold text-left', className)} {...props}>
			{children}
		</th>
	);
};

interface TableRowProps extends DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> {
	children: React.ReactNode;
}

export const TableRow = ({ children, className, ...props }: TableRowProps) => {
	return (
		<tr
			className={twMerge('border-collapse text-primary-600 transition-colors hover:bg-primary-50', className)}
			{...props}
		>
			{children}
		</tr>
	);
};

interface TableCellProps
	extends DetailedHTMLProps<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement> {
	children: React.ReactNode;
}

export const TableCell = ({ children, className, ...props }: TableCellProps) => {
	return (
		<td className={twMerge('rounded-bl-md px-4 py-3', className)} {...props}>
			{children}
		</td>
	);
};
