import Link from "next/link";
import { codexCategories } from "@/data/lore";
import Tag from "@/components/ui/tag";

export default function CodexNav() {
  return (
    <nav className="flex flex-wrap justify-center gap-4 py-12">
      {codexCategories.map((cat) => (
        <Link key={cat.id} href={cat.href} className="cursor-hover" data-cursor-hover>
          <Tag variant="gold">{cat.label}</Tag>
        </Link>
      ))}
    </nav>
  );
}
