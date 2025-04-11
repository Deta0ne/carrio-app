import { FilterFn } from '@tanstack/react-table';

export const globalSearchFilter: FilterFn<any> = (row, columnId, filterValue) => {
    if (typeof filterValue !== 'string' || !filterValue) return true;
    
    const searchTerm = filterValue.toLowerCase();
    
    const companyName = row.getValue('company_name');
    const position = row.getValue('position');
    
    const companyNameStr = companyName ? String(companyName).toLowerCase() : '';
    const positionStr = position ? String(position).toLowerCase() : '';
    
    return companyNameStr.includes(searchTerm) || positionStr.includes(searchTerm);
}; 