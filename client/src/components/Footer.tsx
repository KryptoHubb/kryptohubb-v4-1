import { ArrowUpRight, Github, Linkedin, Twitter } from "lucide-react";
import { useDemoAction } from "@/hooks/useDemoAction";
import { BrandMark } from "./brand/BrandMark";

const linkGroups = [
  { title: "Products", links: ["Exchange", "Earn", "API", "Institutional"] },
  {
    title: "Learn",
    links: ["Market watch", "Insights", "Glossary", "Research"],
  },
  { title: "Company", links: ["About", "Careers", "Security", "Contact"] },
];

export function Footer() {
  const demoAction = useDemoAction();
  return (
    <footer className="bg-[#0d0f0c] pt-16 sm:pt-20">
      <div className="container">
        <div className="grid gap-12 border-b border-white/[0.08] pb-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <BrandMark />
            <p className="mt-6 max-w-sm text-sm leading-6 text-[#727b6d]">
              A clearer way to navigate crypto. Built for curious beginners,
              serious traders, and everyone in between.
            </p>
            <button
              onClick={() => demoAction("Join KryptoHubb")}
              className="group mt-7 inline-flex items-center gap-2 rounded-lg bg-[#d5ff38] px-4 py-3 text-sm font-semibold text-[#10120f] transition hover:bg-[#e4ff85] active:scale-[.97]"
            >
              Join KryptoHubb{" "}
              <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {linkGroups.map(({ title, links }) => (
              <div key={title}>
                <p className="eyebrow !text-[10px]">{title}</p>
                <div className="mt-5 grid gap-3">
                  {links.map(link => (
                    <button
                      key={link}
                      onClick={() => demoAction(link)}
                      className="text-left text-sm text-[#899181] transition hover:text-[#d5ff38]"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5 py-6 text-[11px] text-[#626c5f] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 KryptoHubb Technologies. Demo experience only.</p>
          <div className="flex items-center gap-4">
            <button
              aria-label="KryptoHubb on Twitter"
              onClick={() => demoAction("Twitter")}
              className="transition hover:text-[#d5ff38]"
            >
              <Twitter className="size-4" />
            </button>
            <button
              aria-label="KryptoHubb on Github"
              onClick={() => demoAction("Github")}
              className="transition hover:text-[#d5ff38]"
            >
              <Github className="size-4" />
            </button>
            <button
              aria-label="KryptoHubb on Linkedin"
              onClick={() => demoAction("LinkedIn")}
              className="transition hover:text-[#d5ff38]"
            >
              <Linkedin className="size-4" />
            </button>
            <span className="ml-2 border-l border-white/[0.1] pl-5">
              English (EN) · USD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
