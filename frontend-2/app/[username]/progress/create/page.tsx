import { cookies } from "next/headers";
import ProgressForm from "../ProgressForm";

export default function ProgressCreatePage({
  params: { username },
  searchParams: { date },
}: {
  params: { username: string };
  searchParams: { date?: string };
}) {
  const token = cookies().get("accessToken")?.value;
  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">Create Progress</h1>
      <div className="max-w-sm">
        <ProgressForm username={username} date={date} token={token} />
      </div>
    </div>
  );
}
