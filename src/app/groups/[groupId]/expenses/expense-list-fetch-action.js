'use server';
import { getGroupExpenses } from '@/lib/api';
export async function getGroupExpensesAction(groupId, options) {
    'use server';
    try {
        return getGroupExpenses(groupId, options);
    }
    catch {
        return null;
    }
}
