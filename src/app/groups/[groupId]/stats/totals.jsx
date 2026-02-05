'use client';
import { TotalsGroupSpending } from '@/app/groups/[groupId]/stats/totals-group-spending';
import { TotalsYourShare } from '@/app/groups/[groupId]/stats/totals-your-share';
import { TotalsYourSpendings } from '@/app/groups/[groupId]/stats/totals-your-spending';
import { Skeleton } from '@/components/ui/skeleton';
export function Totals({ totalGroupSpendings, totalParticipantSpendings, totalParticipantShare, currency, }) {
    if (totalGroupSpendings === undefined || !currency)
        return (<div className="flex flex-col gap-7">
        {[0, 1, 2].map((index) => (<div key={index}>
            <Skeleton className="mt-1 h-3 w-48"/>
            <Skeleton className="mt-3 h-4 w-20"/>
          </div>))}
      </div>);
    return (<>
      <TotalsGroupSpending totalGroupSpendings={totalGroupSpendings} currency={currency}/>
      {totalParticipantSpendings !== undefined &&
            totalParticipantShare !== undefined && (<>
            <TotalsYourSpendings totalParticipantSpendings={totalParticipantSpendings} currency={currency}/>
            <TotalsYourShare totalParticipantShare={totalParticipantShare} currency={currency}/>
          </>)}
    </>);
}
