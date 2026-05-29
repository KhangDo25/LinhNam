export default function MountainSilhouette() {
  return (
    <svg
      viewBox="0 0 1440 320"
      className="w-full h-auto text-gold/20"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        opacity="0.15"
        d="M0,320 L0,200 Q200,120 400,180 T800,140 T1200,100 L1440,80 L1440,320 Z"
      />
      <path
        fill="currentColor"
        opacity="0.25"
        d="M0,320 L0,240 Q300,160 600,220 T1100,160 L1440,200 L1440,320 Z"
      />
      <path
        fill="currentColor"
        opacity="0.35"
        d="M0,320 L0,280 Q400,220 720,260 T1440,240 L1440,320 Z"
      />
    </svg>
  );
}
