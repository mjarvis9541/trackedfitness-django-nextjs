import { API } from "@/utils/constants";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileDetail from "./ProfileDetail";

export async function getProfile({ username }: { username?: string }) {
  const token = cookies().get("accessToken")?.value;
  const usern = cookies().get("username")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/profiles/${username || usern}/`, {
    headers,
  });
  if (res.status === 404) {
    return;
  }
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export const metadata: Metadata = {
  title: "Profile - Trackedfitness",
  description: "Trackedfitness user profile",
};

export default async function ProfilePage() {
  const profile = await getProfile({});
  if (!profile) {
    notFound();
  }
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Profile</h1>

      <div className="mb-4 flex">
        <div className="basis-1/4 rounded border border-zinc-500 p-4">
          <Image
            src={profile.image}
            alt="Profile picture"
            height={200}
            width={200}
          />
        </div>
        <div className="p-4">Hello</div>
      </div>

      <div className="mb-4">
        <ProfileDetail profile={profile} />
      </div>

      <ul>
        <li className="mb-2">
          <Link className="text-blue-500" href="profile/setup">
            Set up profile
          </Link>
        </li>
        <li className="mb-2">
          <Link className="text-blue-500" href="profile/edit">
            Edit profile
          </Link>
        </li>
        <li className="mb-2">
          <Link className="text-blue-500" href="profile/edit-profile-picture">
            Edit profile picture
          </Link>
        </li>
        <li className="mb-2">
          <Link className="text-blue-500" href="diet-targets/edit">
            Edit targets
          </Link>
        </li>
      </ul>
    </div>
  );
}
