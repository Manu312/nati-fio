import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      <Hero />
      <Services />
    </div>
  );
}
