import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import Card from "@/components/ui/card";

interface AuthFormShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function AuthFormShell({
  title,
  subtitle,
  children,
  footer,
}: AuthFormShellProps) {
  return (
    <PageAtmosphere variant="gold" className="text-bone pt-32 min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.35em] text-gold/70 hover:text-gold mb-8 inline-block"
        >
          ← Linh Nam
        </Link>
        <h1 className="font-heading text-4xl text-gold mb-2">{title}</h1>
        <p className="text-sm text-bone/70 mb-8">{subtitle}</p>
        <Card className="p-8 md:p-10 border-gold/20" glow>
          {children}
        </Card>
        <p className="mt-6 text-center text-sm text-bone/60">{footer}</p>
      </div>
    </PageAtmosphere>
  );
}
