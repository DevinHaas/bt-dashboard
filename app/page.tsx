import { EmailForm } from "./components/EmailForm";
import { BenefitsSection } from "./components/BenefitsSection";

export default function Home() {
  return (
    <main className="container flex flex-col items-center justify-center mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mt-6 mb-6 group">
        <span className="inline-block hover:animate-wave hover:cursor-pointer">
          👋
        </span>
        Willkommen zu meiner Bachelor Thesis
      </h1>
      <p className="mb-4">
        Wenn du interesse hast an dieser Bachelor Arbeit teilzunehmen schreibe
        dich bitte hier mit deiner E-Mail ein.
      </p>
      <EmailForm></EmailForm>
      <BenefitsSection></BenefitsSection>
    </main>
  );
}
