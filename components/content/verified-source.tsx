import { ExternalLink, ShieldCheck } from "lucide-react";

export interface Citation {
  label: string;
  url: string;
}

interface VerifiedSourceProps {
  summary: string;
  citations: Citation[];
  className?: string;
}

export default function VerifiedSource({
  summary,
  citations,
  className = "",
}: VerifiedSourceProps) {
  return (
    <aside
      className={`rounded-sm border border-gold/20 bg-mist/40 p-5 md:p-6 ${className}`}
    >
      <div className="flex items-start gap-2 mb-3">
        <ShieldCheck className="text-gold shrink-0 mt-0.5" size={16} />
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
          Nguồn kiểm chứng
        </p>
      </div>
      <p className="text-xs md:text-sm text-bone/75 leading-relaxed mb-4">{summary}</p>
      <ul className="space-y-2">
        {citations.map((c) => (
          <li key={c.url}>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline break-all"
            >
              <ExternalLink size={12} className="shrink-0" />
              {c.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-bone/45 mt-4 leading-relaxed">
        Nội dung tóm lược từ nguồn công khai; vui lòng đối chiếu bài viết gốc trước khi trích dẫn học thuật.
      </p>
    </aside>
  );
}
