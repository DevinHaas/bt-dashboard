import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    title: "Dinnerparty 🎉",
    description:
      "Nimm an einer von mir organisierten Dinnerparty mit allen Teilnehmenden teil.",
    height: "h-48 md:h-64",
    width: "w-full md:w-64",
  },
  {
    title: "Gutschein 🎁",
    description: "Erhalte eine Geschenkkarte im Wert von 10 $.",
    height: "h-56 md:h-80",
    width: "w-full md:w-80",
  },
  {
    title: "Dankbarkeit 😇",
    description: "Ganz viel Dankbarkeit und Wertschätzung.",
    height: "h-48 md:h-64",
    width: "w-full md:w-64",
  },
];

export function BenefitsSection() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6">
        {benefits.map((benefit, index) => (
          <Card
            key={index}
            className={`${benefit.height} ${benefit.width} flex flex-col justify-between`}
          >
            <CardHeader>
              <CardTitle>{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
