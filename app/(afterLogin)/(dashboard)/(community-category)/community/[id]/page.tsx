export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>CommunityDetailPage {id}</div>;
}
