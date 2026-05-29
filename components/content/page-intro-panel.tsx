import VerifiedSource, { type Citation } from "@/components/content/verified-source";
import Card from "@/components/ui/card";

interface PageIntroPanelProps {
  title: string;
  body: string;
  citations: Citation[];
  tips?: string[];
}

export default function PageIntroPanel({
  title,
  body,
  citations,
  tips,
}: PageIntroPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <Card className="lg:col-span-2 p-6 md:p-8 border-gold/15" glow>
        <h2 className="font-heading text-2xl text-gold mb-3">{title}</h2>
        <p className="text-sm text-bone/80 leading-relaxed">{body}</p>
        {tips && tips.length > 0 && (
          <ul className="mt-4 space-y-2 text-xs text-bone/65 list-disc pl-5">
            {tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </Card>
      <VerifiedSource summary="Tham chiếu chính thức:" citations={citations} />
    </div>
  );
}
