import { API } from "@/utils/constants";
import titleCase from "@/utils/title-case";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export async function getBrand({ brandId }: { brandId: string }) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/brands/${brandId}/`, { headers });
  if (res.status === 404) {
    return;
  }
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export async function generateMetadata({
  params: { brandId },
}: {
  params: { brandId: string };
}): Promise<Metadata> {
  const brand = await getBrand({ brandId });
  if (!brand) {
    notFound();
  }
  return {
    title: `${titleCase(brand.name)} - Trackedfitness`,
    description:
      "Brand detail page, displaying information from the brand database",
  };
}

export default async function BrandLayout({
  children,
  params: { brandId },
}: {
  children: React.ReactNode;
  params: {
    brandId: string;
  };
}) {
  const brand = await getBrand({ brandId });
  return <>{children}</>;
}
