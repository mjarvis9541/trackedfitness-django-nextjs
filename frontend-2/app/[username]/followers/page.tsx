import serverFetch from "@/utils/server-fetch";

export default async function UserFollowersPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const followers = await serverFetch({ url: `users/${username}/followers/` });

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">Followers</h1>
      {followers.map((follower) => (
        <div key={follower.id}>{follower.user_username}</div>
      ))}
    </div>
  );
}
