import { DailyCheckInForm } from "@/app/components/DailyCheckinForm";

export default async function Dashboard() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, David</h1>
      <h2 className="text-2xl font-semibold mb-4">Daily Check-in 📆</h2>
      <DailyCheckInForm userId={"test"}></DailyCheckInForm>
    </main>
  );
}
