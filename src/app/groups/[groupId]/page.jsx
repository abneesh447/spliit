import { redirect } from 'next/navigation';
export default async function GroupPage({ params, }) {
    const { groupId } = await params;
    redirect(`/groups/${groupId}/expenses`);
}
