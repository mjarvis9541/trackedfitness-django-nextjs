import { mealList } from "@/utils/constants";
import Link from "next/link";

type Props = {
  username: string;
  date: string;
  path: "add-food" | "add-meal";
};

export default function DietMealNav({ username, date, path }: Props) {
  return (
    <div className="flex gap-4">
      {mealList.map((meal) => (
        <Link
          href={`/${username}/diet/${date}/${meal.order}/${path}`}
          key={meal.order}
          className="w-1/6 border-[1px] bg-gray-200 p-1.5 text-center hover:bg-gray-300"
        >
          <h3>{meal.name}</h3>
        </Link>
      ))}
    </div>
  );
}
