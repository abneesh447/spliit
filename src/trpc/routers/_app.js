import { categoriesRouter } from '@/trpc/routers/categories';
import { groupsRouter } from '@/trpc/routers/groups';
import { createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
    groups: groupsRouter,
    categories: categoriesRouter,
});
