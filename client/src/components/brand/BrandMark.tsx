type BrandMarkProps = { compact?: boolean };

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-2.5" aria-label="KryptoHubb home">
      <span className="relative grid size-8 place-items-center rounded-[10px] bg-[#d5ff38] text-[#10120f] shadow-[0_0_0_1px_rgba(213,255,56,.2),0_8px_22px_rgba(213,255,56,.13)]">
        <span className="absolute size-4 rotate-45 rounded-[4px] border-[2px] border-[#10120f]" />
        <span className="absolute h-4 w-[2px] rotate-45 rounded-full bg-[#10120f]" />
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-[-0.03em] text-[#f3f2e8]">
          Krypto<span className="text-[#d5ff38]">Hubb</span>
        </span>
      )}
    </div>
  );
}
