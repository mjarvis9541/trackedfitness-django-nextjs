import { Metadata } from "next";
import { cookies } from "next/headers";
import BrandForm from "../BrandForm";

export const metadata: Metadata = {
  title: "New Brand - Trackedfitness",
  description: "Add a new brand to the Trackedfitness brand database",
};

export default function BrandCreatePage() {
  const token: string | undefined = cookies().get("accessToken")?.value;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Create Brand</h1>
      <div className="max-w-sm">
        <BrandForm token={token} />
      </div>
    </div>
  );
}
