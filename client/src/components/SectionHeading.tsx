import { ArrowUpRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  body,
  link,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  link?: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 className="display text-4xl leading-[0.96] text-[#f2f2e9] sm:text-5xl">
          {title}
        </h2>
        {body && (
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#909786]">
            {body}
          </p>
        )}
      </div>
      {link && (
        <a
          href="#markets"
          className="group inline-flex items-center gap-2 self-start text-sm font-medium text-[#d5ff38] transition hover:text-[#edffad] md:self-end"
        >
          {link}
          <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )}
    </div>
  );
}
