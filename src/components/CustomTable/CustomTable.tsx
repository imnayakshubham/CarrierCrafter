import { useMemo, useState } from "react";
import "./CustomTable.css"
import { Spinner } from "@chakra-ui/react";

interface Column<T> {
    title: string;
    dataIndex: string;
    render?: (text: any, record: T) => React.ReactNode;
    className?: string;
}

interface RowSelection<T> {
    type: 'checkbox' | 'radio';
    onChange: (selectedRowKeys: string[], selectedRows: T) => void;
    selectedRowKeys?: string[];
    rowSelectionDisabled?: (record: T) => boolean;
    rowClassName?: string;
}


interface CustomTableProps<T> {
    columns: Column<T>[];
    dataSource: T[];
    rowSelection?: RowSelection<T>;
    rowId?: keyof T;
    rowClassName?: string;
    loading?: boolean;
}
// {carriersList.loading && <div>Loading...</div>}


export const CustomTable = <T extends Record<string, any>>({ columns = [], dataSource = [], rowSelection, rowId = "key", rowClassName = "row", loading = false }: CustomTableProps<T>) => {
    const updatedDataSource = useMemo(() => {
        return dataSource.map((row, index) => {
            return {
                ...row,
                key: row[rowId] ?? index.toString(),
            };
        });
    }, [dataSource, rowId]);

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(rowSelection?.selectedRowKeys ?? []);

    const handleRadioChange = (key: string, row: T) => {
        if (!key) {
            throw new Error("key is required");
        }
        if (rowSelection && rowSelection.onChange) {
            if (rowSelection.type === "radio") {
                rowSelection.onChange([key], row);
                setSelectedRowKeys([key]);
            } else {
                const data = selectedRowKeys.includes(key) ? selectedRowKeys.filter((k) => k !== key) : [...selectedRowKeys, key];
                setSelectedRowKeys(data);
                rowSelection.onChange(data, row);
            }
        }
    };

    return (
        <table className="custom__table">
            <thead>
                <tr>
                    {rowSelection && <th className="row__selection"></th>}
                    {columns.map((column, index) => (
                        <th key={index}>{column.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {updatedDataSource.length === 0 || loading ? (
                    <tr style={{ height: 200 }}><td style={{ textAlign: "center" }} className="no__data row" colSpan={columns.length + (rowSelection ? 1 : 0)}>{loading ?
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                        : "No Data"}</td></tr>
                ) : (
                    updatedDataSource.map((row, rowIndex) => (
                        <tr key={row.key ?? rowIndex} className={`${rowClassName} ${selectedRowKeys.includes(row.key) ? 'selected_row' : ''}`}>
                            {rowSelection && rowSelection.type === "checkbox" && (
                                <td key={`checkbox-${row.key}`} className="row__selection">
                                    <input
                                        className="row__selection__checkbox"
                                        disabled={rowSelection.rowSelectionDisabled?.(row)}
                                        name={row.key}
                                        type='checkbox'
                                        onChange={() => handleRadioChange?.(row.key, row)}
                                    />
                                </td>
                            )}
                            {rowSelection && rowSelection.type === "radio" && (
                                <td key={`radio-${row.key}`} className="row__selection">
                                    <input
                                        className="row__selection__radio"
                                        disabled={rowSelection.rowSelectionDisabled?.(row)}
                                        type='radio'
                                        checked={row.key === selectedRowKeys[0]}
                                        onChange={() => handleRadioChange(row.key, row)}
                                    />
                                </td>
                            )}
                            {columns.map((column, colIndex) => {
                                const columnRender = column.render ?? ((text) => text);
                                const columnData = columnRender(row[column.dataIndex], row);
                                return (
                                    <td key={colIndex} data-label={column.title} className={column.className}>{columnData}</td>
                                );
                            })}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};