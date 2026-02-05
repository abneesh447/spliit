import { getExpenseShares, getParticipantShare } from '@/lib/shares';
/**
 * Filters expenses to those whose `expenseDate` falls within an inclusive
 * `[from, to]` range. Bounds are `YYYY-MM-DD` strings; either may be omitted.
 * Expense dates are stored as date-only values (UTC midnight), so the
 * comparison is done on the date portion to stay timezone-safe.
 */
export function filterExpensesByDateRange(expenses, from, to) {
    if (!from && !to)
        return expenses;
    return expenses.filter((expense) => {
        const date = expense.expenseDate.toISOString().slice(0, 10);
        if (from && date < from)
            return false;
        if (to && date > to)
            return false;
        return true;
    });
}
export function getTotalGroupSpending(expenses) {
    return expenses.reduce((total, expense) => expense.isReimbursement ? total : total + expense.amount, 0);
}
export function getTotalActiveUserPaidFor(activeUserId, expenses) {
    return expenses.reduce((total, expense) => expense.paidBy.id === activeUserId && !expense.isReimbursement
        ? total + expense.amount
        : total, 0);
}
/**
 * Maps an expense into the shape {@link getExpenseShares} takes. The id decides
 * who is offered the leftover minor unit of an uneven split; passing it keeps
 * the stats and the expense form in step with the balances tab.
 */
function toShareInput(expense) {
    return {
        id: expense.id,
        amount: expense.amount,
        splitMode: expense.splitMode,
        paidFor: expense.paidFor.map(({ participant, shares }) => ({
            participantId: participant.id,
            shares: Number(shares),
        })),
    };
}
/**
 * A participant's share of a single expense, in whole minor units.
 *
 * Delegates to the shared apportionment so that the number shown on the stats
 * pages, in the CSV export and next to a participant in the expense form is the
 * same one the balances tab charges them. Reimbursements count as zero here:
 * unlike balances, the spending stats deliberately ignore settling up.
 */
export function calculateShare(participantId, expense) {
    if (expense.isReimbursement)
        return 0;
    return getParticipantShare(participantId, toShareInput(expense));
}
export function getTotalActiveUserShare(activeUserId, expenses) {
    // Every share is a whole number of minor units, so the sum needs no rounding
    // — rounding it here is what used to make the totals disagree with balances.
    return expenses.reduce((sum, expense) => sum + calculateShare(activeUserId, expense), 0);
}
/**
 * Aggregates total spending by category (issue #82). Reimbursements are
 * excluded, mirroring the other spending totals. Categories with a net total
 * of zero are dropped and the result is sorted from highest to lowest spend.
 */
export function getSpendingByCategory(expenses) {
    const byCategory = new Map();
    for (const expense of expenses) {
        if (expense.isReimbursement)
            continue;
        const category = expense.category;
        const categoryId = category?.id ?? 0;
        const existing = byCategory.get(categoryId);
        if (existing) {
            existing.total += expense.amount;
        }
        else {
            byCategory.set(categoryId, {
                categoryId,
                grouping: category?.grouping ?? 'Uncategorized',
                name: category?.name ?? 'General',
                total: expense.amount,
            });
        }
    }
    return [...byCategory.values()]
        .filter((category) => category.total !== 0)
        .sort((a, b) => b.total - a.total);
}
/**
 * Returns the individual expenses that make up a single category's spending,
 * so the stats page can drill down from the "by category" card into the
 * matching expenses. Uses the same category-matching (`category?.id ?? 0`) and
 * reimbursement exclusion as {@link getSpendingByCategory} so the list is
 * consistent with the aggregated total, and sorts newest first.
 */
export function getExpensesByCategory(expenses, categoryId) {
    return expenses
        .filter((expense) => !expense.isReimbursement && (expense.category?.id ?? 0) === categoryId)
        .sort((a, b) => b.expenseDate.getTime() - a.expenseDate.getTime());
}
/**
 * Returns the individual expenses that fall within a single `YYYY-MM` month, so
 * the stats page can drill down from the "over time" card into the matching
 * expenses. Uses the same month key and reimbursement exclusion as
 * {@link getSpendingOverTime} so the list is consistent with the bar's total,
 * and sorts newest first.
 */
export function getExpensesByMonth(expenses, month) {
    return expenses
        .filter((expense) => !expense.isReimbursement &&
        expense.expenseDate.toISOString().slice(0, 7) === month)
        .sort((a, b) => b.expenseDate.getTime() - a.expenseDate.getTime());
}
/**
 * Computes, for every participant, how much they paid, how many expenses they
 * paid for, and what their share of the group's expenses is (issue #496) in a
 * single pass over the expenses. Sorted by amount paid, descending.
 */
export function getSpendingByParticipant(participants, expenses) {
    const totals = new Map();
    for (const participant of participants) {
        totals.set(participant.id, { paid: 0, paidCount: 0, share: 0 });
    }
    for (const expense of expenses) {
        if (expense.isReimbursement)
            continue;
        const payer = totals.get(expense.paidBy.id);
        if (payer) {
            payer.paid += expense.amount;
            payer.paidCount += 1;
        }
        // Split the expense once and hand out the shares, rather than re-deriving
        // the whole split for every participant.
        for (const [participantId, share] of getExpenseShares(toShareInput(expense))) {
            const entry = totals.get(participantId);
            if (entry)
                entry.share += share;
        }
    }
    return participants
        .map((participant) => {
        const entry = totals.get(participant.id);
        return {
            participantId: participant.id,
            name: participant.name,
            paid: entry.paid,
            paidCount: entry.paidCount,
            share: entry.share,
        };
    })
        .sort((a, b) => b.paid - a.paid);
}
/**
 * Aggregates non-reimbursement spending into monthly buckets (`YYYY-MM`),
 * filling any gaps between the first and last month so the trend reads
 * continuously. Sorted chronologically.
 */
export function getSpendingOverTime(expenses) {
    const totals = new Map();
    for (const expense of expenses) {
        if (expense.isReimbursement)
            continue;
        const month = expense.expenseDate.toISOString().slice(0, 7);
        totals.set(month, (totals.get(month) ?? 0) + expense.amount);
    }
    if (totals.size === 0)
        return [];
    const months = [...totals.keys()].sort();
    const [firstYear, firstMonth] = months[0].split('-').map(Number);
    const [lastYear, lastMonth] = months[months.length - 1].split('-').map(Number);
    const result = [];
    let year = firstYear;
    let month = firstMonth;
    while (year < lastYear || (year === lastYear && month <= lastMonth)) {
        const key = `${year}-${String(month).padStart(2, '0')}`;
        result.push({ month: key, total: totals.get(key) ?? 0 });
        month += 1;
        if (month > 12) {
            month = 1;
            year += 1;
        }
    }
    return result;
}
/**
 * Computes high-level summary metrics over the non-reimbursement expenses: how
 * many there are, the average and largest expense, and the active date span.
 */
export function getSpendingSummary(expenses) {
    const relevant = expenses.filter((expense) => !expense.isReimbursement);
    const expenseCount = relevant.length;
    const totalSpending = relevant.reduce((total, expense) => total + expense.amount, 0);
    let largestExpense = null;
    for (const expense of relevant) {
        if (!largestExpense || expense.amount > largestExpense.amount) {
            largestExpense = { title: expense.title, amount: expense.amount };
        }
    }
    const dates = relevant
        .map((expense) => expense.expenseDate.toISOString().slice(0, 10))
        .sort();
    return {
        expenseCount,
        totalSpending,
        averageExpense: expenseCount ? Math.round(totalSpending / expenseCount) : 0,
        largestExpense,
        firstDate: dates[0] ?? null,
        lastDate: dates[dates.length - 1] ?? null,
    };
}
// How many times each recurrence period occurs within an average month and
// year, used to normalize recurring spending to comparable monthly/yearly
// figures. Based on the average year length of 365.25 days. The Record is
// exhaustive over RecurrencePeriod, so a new enum value forces an update here.
const PERIOD_FACTORS = {
    DAILY: { perMonth: 365.25 / 12, perYear: 365.25 },
    WEEKLY: { perMonth: 365.25 / 12 / 7, perYear: 365.25 / 7 },
    MONTHLY: { perMonth: 1, perYear: 12 },
};
const RECURRENCE_PERIODS = Object.keys(PERIOD_FACTORS);
/**
 * Summarizes the active recurring expenses of a group (issue #508). Each active
 * recurring expense is counted once per period and normalized into an estimated
 * monthly and yearly cost so the stats page can act as a basic subscription
 * tracker. Monthly and yearly are computed independently (not monthly × 12) to
 * avoid compounding the monthly rounding.
 */
export function getRecurringSpending(expenses) {
    const byPeriod = RECURRENCE_PERIODS.map((period) => {
        const matching = expenses.filter((expense) => !expense.isReimbursement && expense.recurrenceRule === period);
        return {
            period,
            count: matching.length,
            total: matching.reduce((sum, expense) => sum + expense.amount, 0),
        };
    });
    const estimate = (factor) => Math.round(byPeriod.reduce((sum, { period, total }) => sum + total * PERIOD_FACTORS[period][factor], 0));
    return {
        count: byPeriod.reduce((sum, { count }) => sum + count, 0),
        byPeriod: byPeriod.filter(({ count }) => count > 0),
        estimatedMonthly: estimate('perMonth'),
        estimatedYearly: estimate('perYear'),
    };
}
