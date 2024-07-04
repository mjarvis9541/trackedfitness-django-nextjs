import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy - Trackedfitness",
  description: "Diet and fitness tracking web application",
};

export default function PrivacyPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Privacy</h1>
    </div>
  );
}
