import { BookOpenIcon } from "@/components/icons";

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sdg-600 text-white">
        <BookOpenIcon className="h-5 w-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight text-ink">
          SDG 4 Indonesia
        </span>
        <span className="text-[11px] text-ink-soft">Pendidikan Berkualitas</span>
      </span>
    </span>
  );
}