import { Metadata } from "next";
import { cookies } from "next/headers";
import { getProfile } from "../page";
import ProfileForm from "../ProfileForm";

export const metadata: Metadata = {
  title: "Edit Profile - Trackedfitness",
  description: "Edit trackedfitness user profile",
};

export default async function ProfileUpdatePage() {
  const token = cookies().get("accessToken")?.value;
  const profile = await getProfile({});

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>

      <p className="mb-4">
        Update your fitness profile. This gives you information such as your
        current Body Mass Index (BMI), Basal Metabolic Rate (BMR) and total
        daily energy expenditure.
      </p>

      <ProfileForm profile={profile} token={token} />
    </div>
  );
}
