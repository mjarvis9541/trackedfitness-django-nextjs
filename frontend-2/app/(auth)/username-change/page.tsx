import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Username - Trackedfitness",
  description: "Change your Trackedfitness user account username",
};

export default function UsernameChangePage() {
  return (
    <div>
      <h1>Change Username</h1>
      <p>Usernames can only be changed once every 30 days.</p>
    </div>
  );
}
