import { cached } from '@/app/cached-functions';
import { GroupLayoutClient } from './layout.client';
export async function generateMetadata({ params }) {
    const { groupId } = await params;
    const group = await cached.getGroup(groupId);
    return {
        title: {
            default: group?.name ?? '',
            template: `%s · ${group?.name} · Spliit`,
        },
    };
}
export default async function GroupLayout({ children, params, }) {
    const { groupId } = await params;
    return <GroupLayoutClient groupId={groupId}>{children}</GroupLayoutClient>;
}
