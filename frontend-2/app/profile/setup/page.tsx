import { Metadata } from "next";
import { cookies } from "next/headers";
import { getProfile } from "../page";
import ProfileForm from "../ProfileForm";

export const metadata: Metadata = {
  title: "Set Up Profile - Trackedfitness",
  description: "Set up your trackedfitness user profile",
};

export default async function ProfileSetUpPage() {
  const token = cookies().get("accessToken")?.value;
  const profile = await getProfile({});

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Set Up Profile</h1>

      <p>
        Setting up you profile will set your diet targets based on your current
        age, sex, height, weight, activity level and fitness goal.
      </p>

      <ProfileForm profile={profile} token={token} isInitialSetUp={true} />
    </div>
  );
}
