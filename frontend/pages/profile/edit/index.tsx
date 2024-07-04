import Head from "next/head";
import Link from "next/link";
import ProfileUpdateForm from "../../../app/profiles/ProfileUpdateForm";
import useGetProfile from "../../../app/profiles/useGetProfile";

export default function ProfileUpdatePage() {
  const { isLoading, error, data } = useGetProfile();
  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error</div>;

  return (
    <>
      <Head>
        <title>Edit Profile - Trackedfitness</title>
      </Head>
      <div className="space-y-4 p-4">
        <h1 className="text-xl font-bold">Edit Profile</h1>

        <p>
          Update your fitness profile. This gives you information such as your
          current Body Mass Index (BMI), Basal Metabolic Rate (BMR) and total
          daily energy expenditure.
        </p>

        <ProfileUpdateForm data={data} />

        <section>
          <h3 className="mt-4 font-bold">Activity Levels</h3>
          <ul className="mt-2  space-y-4 px-4 text-sm text-gray-400">
            <li>Sedentary - little or no exercise/desk job</li>
            <li>Lightly Active - light exercise/sports 1-3 days a week</li>
            <li>
              Moderately Active - Moderate exercise/sports 3-5 days a week
            </li>
            <li>Very Active - Heavy exercise/sports 6-7 days a week</li>
            <li>
              Extremely Active - Very heavy exercise/physical job/training twice
              a day
            </li>
          </ul>
        </section>

        <div>
          <Link
            href="/profile/set-up"
            className="text-blue-500 hover:underline"
          >
            Switch to Set up Profile
          </Link>
        </div>
        <div>
          <Link href="/profile" className="text-blue-500 hover:underline">
            Return to Profile
          </Link>
        </div>
      </div>
    </>
  );
}
