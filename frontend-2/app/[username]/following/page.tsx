import serverFetch from "@/utils/server-fetch";

export default async function UserFollowingPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const following = await serverFetch({ url: `users/${username}/following/` });
  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">Following</h1>
      {following.map((following) => (
        <div key={following.id}>{following.following_username}</div>
      ))}
    </div>
  );
}
