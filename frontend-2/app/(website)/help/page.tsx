import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help - Trackedfitness",
  description: "Diet and fitness tracking web application",
};

export default function Help() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Help</h1>

      <h2>I have not received my activation email</h2>
      <p>Make sure you have your spam folder.</p>
      <p>
        Request a new activation email{" "}
        <Link href="/resend-activation-email">here</Link>.
      </p>

      <h2>How do I set up diet targets?</h2>
      <p>
        You can set your base diet targets <Link href="/">here</Link>. If you
        wish to customize your diets for an individual, you can do so at the{" "}
        <Link href="/">diet week target page</Link>.
      </p>

      <h2>How do I log progress?</h2>
      <p>
        You can log daily dieting progress such as a weight and estimated
        calories burnt (if you use any sort of fitness tracking watch/device).
        By setting these values you will be able to see your average weight and
        average calories burnt for the week and month. This is useful in helping
        decide how many calories you should be eating per day. This would
        usually be around 10% calorie surplus for bulking and 10 to 25% calorie
        deficit for cutting.
      </p>

      <h2>How do I create food?</h2>
      <p>
        You can add new food to the database{" "}
        <Link href="/food/create">here</Link>.
      </p>

      <h2>How do I create a food brand?</h2>
      <p>
        If you attempting to add a new food to the database and the brand does
        not exist, you can add a new brand <Link href="/food/create">here</Link>
        .
      </p>

      <h2>How do I create a meal?</h2>
      <p>
        There&apos; a few ways you can do this. The easiest will be from your
        main <Link href="/">diet logging page</Link>. Simply select the foods
        you wish create a meal with, then click the &quot;Save as Meal&quot;
        button at the bottom of the page. You can also specify a custom name for
        the meal, if not, the meal name will be automatically generated from the
        selected food and values.
        <Link href="/food/create">here</Link>.
      </p>

      <p>
        You can also create a meal directly from the meal list page by clicking
        the <Link href="/">Create Meal</Link> button.
      </p>

      <h2>Body Mass Index (BMI)</h2>
      <p>BMI is...</p>

      <h2>Basal Metabolic Rate (BMR)</h2>
      <p>BMr is...</p>

      <h2>What is Total Daily Energy Expenditure (TDEE)?</h2>
      <p>TDEE is...</p>

      <h2>How do you calculate my target calories?</h2>
      <p>...</p>
    </div>
  );
}
