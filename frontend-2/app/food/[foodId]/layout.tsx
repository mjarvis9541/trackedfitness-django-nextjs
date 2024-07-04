import { Metadata } from "next";
import { getFood } from "./page";

export async function generateMetadata({
  params: { foodId },
}: {
  params: { foodId: string };
}): Promise<Metadata> {
  const food = await getFood({ foodId });
  return { title: `${food.name} - Trackedfitness` };
}

export default function FoodDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid grid-cols-[1fr_2fr_1fr]">
      <div></div>
      <div>{children}</div>
      <div></div>
    </main>
  );
}
