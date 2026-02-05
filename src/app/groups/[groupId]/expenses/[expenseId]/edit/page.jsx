import { EditExpenseForm } from '@/app/groups/[groupId]/expenses/edit-expense-form';
import { getRuntimeFeatureFlags } from '@/lib/featureFlags';
import { getTranslations } from 'next-intl/server';
export async function generateMetadata() {
    const t = await getTranslations('ExpenseForm');
    return {
        title: t('Expense.edit'),
    };
}
export default async function EditExpensePage({ params, }) {
    const { groupId, expenseId } = await params;
    return (<EditExpenseForm groupId={groupId} expenseId={expenseId} runtimeFeatureFlags={await getRuntimeFeatureFlags()}/>);
}
