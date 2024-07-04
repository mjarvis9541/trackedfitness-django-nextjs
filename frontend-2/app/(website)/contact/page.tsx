import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Trackedfitness",
  description: "Diet and fitness tracking web application",
};

export default function ContactPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Contact</h1>
    </div>
  );
}
