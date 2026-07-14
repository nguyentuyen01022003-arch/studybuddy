"use client";

const BG = "b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf";
const STYLES: Array<[string, string[]]> = [
  ["adventurer", ["Milo", "Luna", "Coco", "Hana", "Peanut", "Mochi", "Sunny", "Bao"]],
  ["lorelei", ["Rosie", "Jelly", "Ziggy", "Nova", "Pip", "Mai", "Dusty", "Momo"]],
  ["micah", ["Chip", "Minh", "Gizmo", "An", "Pixel", "Tuan", "Bee", "Willow"]],
];

export const PRESET_AVATARS: string[] = STYLES.flatMap(([style, seeds]) =>
  seeds.map(
    (seed) => `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=${BG}`
  )
);

interface Props {
  current?: string | null;
  onPick: (url: string) => void;
  disabled?: boolean;
}

/** Luoi avatar 2D co san (DiceBear) cho nguoi dung chon nhanh */
export default function AvatarPicker({ current, onPick, disabled }: Props) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
      {PRESET_AVATARS.map((url) => (
        <button
          key={url}
          type="button"
          disabled={disabled}
          onClick={() => onPick(url)}
          className={`aspect-square w-full overflow-hidden rounded-full border-2 transition hover:scale-110 disabled:opacity-50 ${
            current === url
              ? "border-brand-500 ring-2 ring-brand-300"
              : "border-transparent hover:border-brand-200"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="avatar" className="h-full w-full" loading="lazy" />
        </button>
      ))}
    </div>
  );
}
