import { cn } from "@/lib/utils";
import { Marquee } from "./magicui/marquee";
import { useEffect } from "react";
import Aos from "aos";

const partners = [
  {
    name: "1SBI",
    body: "Chief Electoral Officer - Kathy Freschi",
    img: "https://avatar.vercel.sh/1sbi",
  },
  {
    name: "SINR - EDATAS PRIVATE LIMITED",
    body: "Initial corporate headquarters with certified panel positions",
    img: "https://avatar.vercel.sh/sinr",
  },
  {
    name: "BLOE STAR",
    body: "An initial business of the first year",
    img: "https://avatar.vercel.sh/bloestar",
  },
  {
    name: "FAIR CAPITAL",
    body: "MANAGEMENT PAY, LTD. - July 2022",
    img: "https://avatar.vercel.sh/faircapital",
  },
  {
    name: "RELIANCE GENERAL INSURANCE",
    body: "Insurance solutions partner",
    img: "https://avatar.vercel.sh/reliance",
  },
  {
    name: "DITY UNION BANK",
    body: "Financial services partner",
    img: "https://avatar.vercel.sh/ditybank",
  },
  {
    name: "LBX CASH",
    body: "Digital Ventrication Activity of Kids - Governor of Kids",
    img: "https://avatar.vercel.sh/lbxcash",
  },
  {
    name: "AXIS BANK",
    body: "Digital Ventrication - The New Public Assistance Company Limited",
    img: "https://avatar.vercel.sh/axisbank",
  },
  {
    name: "TRANSACTION ANALYSIS",
    body: "Building Overseas Bank solutions",
    img: "https://avatar.vercel.sh/transaction",
  },
  {
    name: "Indian Overseas Bank",
    body: "Transaction analysis partner",
    img: "https://avatar.vercel.sh/iob",
  },
  {
    name: "ELCOT",
    body: "Technology solutions provider",
    img: "https://avatar.vercel.sh/elcot",
  },
  {
    name: "Xenovex TECHNOLOGY",
    body: "Innovative tech solutions",
    img: "https://avatar.vercel.sh/xenovex",
  },
  {
    name: "clickastro.com",
    body: "Digital platform partner",
    img: "https://avatar.vercel.sh/clickastro",
  },
];

const firstRow = partners.slice(0, partners.length / 2);
const secondRow = partners.slice(partners.length / 2);

const PartnerCard = ({ img, name, body }: { img: string; name: string; body: string }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function PartnersMarquee() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
      <h2 data-aos="zoom-out" className="mb-10 text-2xl md:text-6xl font-bold text-gradient">
        Our Partners
      </h2>
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((partner) => (
          <PartnerCard key={partner.name} {...partner} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((partner) => (
          <PartnerCard key={partner.name} {...partner} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
