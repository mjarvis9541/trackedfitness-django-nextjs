import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Trackedfitness" />
      </Head>

      <h1 className="text-xl font-bold">Trackedfitness</h1>

      <p>
        Trackedfitness is a diet planning and logging web application. Calculate
        your calorie and macronutrient requirements based on your current
        weight, activity level and fitness goals.
      </p>

      <p>Create your account and set up your fitness profile.</p>

      <p>
        Record the food you eat day-to-day, view detailed breakdowns of your
        total calorie and macronutrient consumption.
      </p>

      <p>
        Browse the food database and view accurate calorie and macronuritent
        information on hundreds of foods.
      </p>

      <p>
        Create your own meals, view the calorie and macronutrient content of
        each meal. You can then add these meals to your food diary for quick and
        easy track your daily calorie and macronutrient consumption.
      </p>

      <div className="space-x-4 pt-8">
        <Link
          href="/login"
          className="rounded border bg-gray-100 py-2 px-4 hover:bg-gray-300"
        >
          Log in
        </Link>

        <Link
          href="/signup"
          className="rounded border bg-gray-100 py-2 px-4 hover:bg-gray-300"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
