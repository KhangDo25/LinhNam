"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import Link from "next/link";
import { Wind, Cloud, Waves, Mountain, Compass } from "lucide-react";

type Realm = {
  name: string;
  path: string;
  icon: React.ReactNode;
  desc: string;
};

const realms: Realm[] = [
  {
    name: "Thiên Giới",
    path: "/thien-gioi",
    icon: <Cloud size={28} />,
    desc: "Nơi thiên đạo vĩnh hằng, chín tầng mây che phủ điện thờ cổ thần.",
  },
  {
    name: "Sơn Hải",
    path: "/son-hai",
    icon: <Mountain size={28} />,
    desc: "Vùng đất viễn cổ của linh thú, dị cảnh và những ngọn núi thiêng chạm trời.",
  },
  {
    name: "Thủy Phủ",
    path: "/thuy-phu",
    icon: <Waves size={28} />,
    desc: "Đế quốc uy nghiêm sâu thẳm, nơi Long Vương ngự trị giữa dòng hải lưu xiết.",
  },
  {
    name: "U Minh",
    path: "/u-minh",
    icon: <Wind size={28} />,
    desc: "Cõi vãng sinh của linh hồn, tàn tro vây kín lối vào dị vực tăm tối.",
  },
];

type RealmCardProps = {
  realm: Realm;
  idx: number;
};

function RealmCard({ realm, idx }: RealmCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: idx * 0.15,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full perspective-1000"
    >
      <Link href={realm.path} className="block group">
        <motion.div
          whileHover={{
            scale: 1.02,
            rotateX: 4,
            rotateY: -4,
            backgroundColor: "rgba(198, 169, 114, 0.02)",
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
          }}
          className="relative flex w-full cursor-pointer flex-col items-start gap-8 overflow-hidden rounded-sm border border-[#C6A972]/10 bg-[#0a0a0c]/60 p-12 backdrop-blur-md transition-all duration-500 hover:border-[#C6A972]/50 hover:shadow-[0_0_40px_rgba(198,169,114,0.06)] sm:flex-row sm:items-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#C6A972]/5 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          <div className="shrink-0 rounded-full border border-[#C6A972]/15 bg-black/50 p-5 text-[#C6A972]/40 transition-all duration-500 group-hover:rotate-12 group-hover:border-[#C6A972]/40 group-hover:text-[#C6A972] group-hover:shadow-[0_0_20px_rgba(198,169,114,0.15)]">
            {realm.icon}
          </div>

          <div className="space-y-2">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-medium tracking-widest text-[#E8E0D0] transition-colors duration-300 group-hover:text-[#C6A972]">
              {realm.name}
            </h2>

            <p className="max-w-md text-[11px] font-light leading-relaxed tracking-wide text-[#E8E0D0]/80 opacity-40 transition-opacity duration-300 group-hover:opacity-70">
              {realm.desc}
            </p>
          </div>

          <div className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-widest text-[#C6A972]/10 transition-colors duration-300 group-hover:text-[#C6A972]/30">
            [ Khám Phá ]
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function CoiGioiPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050505] px-6 pt-40 text-[#C6A972] selection:bg-[#C6A972]/10 selection:text-[#C6A972]">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0d0d11] to-[#050505] opacity-95" />

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 mix-blend-screen" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(198,169,114,0.03)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="mb-28 space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="inline-block"
          >
            <Compass
              className="mx-auto animate-[spin_120s_linear_infinite] text-[#C6A972] opacity-40"
              size={44}
            />
          </motion.div>

          <div className="space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-[0.8em] text-[#C6A972]/40">
              Bản Đồ Thần Thoại Linh Nam
            </span>

            <h1 className="mb-4 bg-gradient-to-b from-[#E8E0D0] to-[#C6A972] bg-clip-text font-[family-name:var(--font-cormorant)] text-6xl font-bold tracking-[0.25em] text-transparent md:text-7xl">
              LỤC GIỚI
            </h1>
          </div>

          <div className="mx-auto h-[1px] w-16 bg-[#C6A972]/20" />
        </header>

        <div className="grid grid-cols-1 gap-8 pb-32 md:grid-cols-2">
          {realms.map((realm, idx) => (
            <RealmCard
              realm={realm}
              key={realm.name}
              idx={idx}
            />
          ))}
        </div>

        <footer className="w-full border-t border-[#C6A972]/5 pb-16 pt-12 text-center opacity-30">
          <p className="text-[9px] uppercase tracking-[0.6em] text-[#E8E0D0]">
            Kỳ Thư Địa Lý • Phân Định Biên Giới Linh Hồn
          </p>
        </footer>
      </div>
    </main>
  );
}