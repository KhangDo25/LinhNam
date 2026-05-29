import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import Button from "@/components/ui/button";
import MythHeroImage from "@/components/myth/myth-hero-image";
import { getMythById, getAllMythIds } from "@/data/myths";
import { realms } from "@/data/realms";

export function generateStaticParams() {
  return getAllMythIds().map((slug) => ({ slug }));
}

export default async function MythDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const myth = getMythById(slug);
  if (!myth) notFound();

  const realm = myth.realm ? realms.find((r) => r.slug === myth.realm) : null;

  return (
    <PageAtmosphere variant="gold" className="text-bone pt-32">
      <Navbar />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-safe pb-28 pt-24 md:pt-32">
        <Link
          href="/huyen-thoai"
          className="text-[10px] uppercase tracking-[0.35em] text-gold/70 hover:text-gold mb-8 inline-block"
        >
          ← Huyền Thoại
        </Link>

        <MythHeroImage myth={myth} priority />

        <Tag className="mb-4">{myth.era}</Tag>
        <h1 className="font-heading text-4xl md:text-5xl text-gold mb-2">{myth.name}</h1>
        <p className="font-lore text-lg text-bone/85 mb-10">{myth.title}</p>

        <Card className="p-8 md:p-10 mb-10" glow>
          <p className="text-sm md:text-base text-bone/90 leading-loose whitespace-pre-line">
            {myth.content}
          </p>
        </Card>

        <p className="text-xs text-bone/60 mb-6 leading-relaxed">
          Đây là bản tóm lược phục vụ đọc trên web. Khi trích dẫn học thuật, hãy đối chiếu bài
          Wikipedia hoặc sử thư được liệt kê bên dưới.
        </p>

        <div className="text-xs text-bone/65 border-l-2 border-gold/30 pl-4 mb-10 leading-relaxed space-y-3">
          <div>
            <span className="text-gold/80 uppercase tracking-widest text-[9px] block mb-2">
              Nguồn tham khảo
            </span>
            {myth.source}
          </div>
          <a
            href={myth.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold hover:underline"
          >
            Đọc trên Wikipedia tiếng Việt →
          </a>
          {myth.imageUrl.startsWith("http") && (
            <a
              href={myth.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-bone/50 hover:text-gold"
            >
              Ảnh minh họa: Wikimedia Commons
            </a>
          )}
        </div>

        {realm && (
          <Link href={`/${realm.slug}`}>
            <Button variant="outline" size="sm">
              Khám phá {realm.name}
            </Button>
          </Link>
        )}

        <div className="mt-16 pt-8 border-t border-gold/10">
          <Link href="/su-thi">
            <Button variant="ghost" size="sm">
              Mở Sử Thi đầy đủ
            </Button>
          </Link>
        </div>
      </article>
    </PageAtmosphere>
  );
}
