import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";

const Services = dynamic(() =>
  import("@/components/sections/Services").then((mod) => mod.Services),
  { loading: () => <div className="py-20" /> }
);

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      <Hero />
      <Services />
    </div>
  );
}
