import SectionTitle from "@/components/ui/section-title";
import Card from "@/components/ui/card";
import type { NarrativeBlock } from "@/data/realm-narratives";

interface RealmNarrativeSectionProps {
  eyebrow: string;
  blocks: NarrativeBlock[];
  className?: string;
}

export default function RealmNarrativeSection({
  eyebrow,
  blocks,
  className = "",
}: RealmNarrativeSectionProps) {
  if (!blocks.length) return null;

  return (
    <section className={`relative z-10 py-32 px-6 max-w-4xl mx-auto ${className}`}>
      <SectionTitle eyebrow={eyebrow} title="Sử Thi Cõi Giới" className="mb-16" />
      <div className="space-y-10">
        {blocks.map((block) => (
          <Card key={block.title} className="p-8 md:p-10 border-gold/15" glow>
            <h3 className="font-heading text-2xl text-gold mb-4 tracking-wide">{block.title}</h3>
            <p className="text-sm md:text-base leading-loose text-bone/80">{block.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
