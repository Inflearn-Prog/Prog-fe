export default async function CommunityEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>CommunityEditPage {id}</div>;
}
