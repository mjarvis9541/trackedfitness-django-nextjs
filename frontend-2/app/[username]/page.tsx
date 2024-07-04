import titleCase from "@/utils/title-case";
import type { Metadata } from "next";
import Link from "next/link";
import DietTargetDetail from "../diet-targets/DietTargetDetail";
import { getDietTarget } from "../diet-targets/page";
import { getProfile } from "../profile/page";
import ProfileDetail from "../profile/ProfileDetail";
import { getUser } from "./layout";

export async function generateMetadata({
  params: { username },
}: {
  params: { username: string };
}): Promise<Metadata> {
  const user = await getUser({ username });
  return {
    title: `${titleCase(user.username)} - Trackedfitness`,
    description: "Trackedfitness user profile page",
  };
}

export default async function UserDetailPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const userData = getUser({ username });
  const profileData = getProfile({ username });
  const dietTargetData = getDietTarget({ username });

  const [user, profile, dietTarget] = await Promise.all([
    userData,
    profileData,
    dietTargetData,
  ]);

  return (
    <div className="p-4">
      <div>
        <h2 className="my-2 text-xl font-bold">Profile</h2>
        <ProfileDetail profile={profile} />
        <div className="my-4">
          <Link href="/profile/edit" className="text-blue-500 hover:underline">
            Edit Profile
          </Link>
        </div>
        <div className="my-4">
          <Link
            href="/profile/edit-profile-picture"
            className="text-blue-500 hover:underline"
          >
            Edit Profile Picture
          </Link>
        </div>
        <div className="my-4">
          <Link href="/profile/setup" className="text-blue-500 hover:underline">
            Set Up Profile
          </Link>
        </div>

        <h2 className="my-2 text-xl font-bold">Diet Targets</h2>
        <DietTargetDetail dietTarget={dietTarget} />
        <div className="my-4">
          <Link
            href="/diet-targets/edit"
            className="text-blue-500 hover:underline"
          >
            Edit Diet Targets
          </Link>
        </div>

        <div>
          <Link href="/logout" className="text-blue-500 hover:underline">
            Log out
          </Link>
        </div>
      </div>
    </div>
  );
}
