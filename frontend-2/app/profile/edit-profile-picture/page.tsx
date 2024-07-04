import { Metadata } from "next";
import { cookies } from "next/headers";
import { getProfile } from "../page";
import ProfilePictureForm from "../ProfilePictureForm";

export const metadata: Metadata = {
  title: "Edit Profile Picture - Trackedfitness",
  description: "Update trackedfitness user profile picture.",
};

export default async function ProfilePictureUpdatePage() {
  const token = cookies().get("accessToken")?.value;
  const profile = await getProfile({});

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Profile Picture</h1>
      <p>Upload a new profile picture.</p>

      <ProfilePictureForm profile={profile} token={token} />
    </div>
  );
}
