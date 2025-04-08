import { ScreenshotForm } from "@/components/DailyCheckinForm";
import getNameFromEmailadress from "@/lib/getNameFromEmailadress";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DailyCheckingFormPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Sign in to view this page</div>;
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? null;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome {email ? " " + getNameFromEmailadress(email) : ""} to the Daily
        Check-in 📆
      </h1>
      <h2 className="text-2xl font-semibold mb-4"></h2>
      <ScreenshotForm></ScreenshotForm>
    </main>
  );
}
