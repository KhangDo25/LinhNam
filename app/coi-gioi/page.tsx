"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import Link from "next/link";
import { Map, Wind, Cloud, Waves, Mountain, Compass } from "lucide-react";
import { useRef } from "react";

const realms = [
  { name: "Thiên Giới", path: "/thien-gioi", icon: <Cloud size={28} />, desc: "Nơi thiên đạo vĩnh hằng, chín tầng mây che phủ điện thờ cổ thần." },
  { name: "Sơn Hải", path: "/son-hai", icon: <Mountain size={28} />, desc: "Vùng đất viễn cổ của linh thú, dị cảnh và những ngọn núi thiêng chạm trời." },
  { name: "Thủy Phủ", path: "/thuy-phu", icon: <Waves size={28} />, desc: "Đế quốc uy nghiêm sâu thẳm, nơi Long Vương ngự trị giữa dòng hải lưu xiết." },
  { name: "U Minh", path: "/u-minh", icon: <Wind size={28} />, desc: "Cõi vãng sinh của linh hồn, tàn tro vây kín lối vào dị vực tăm tối." },
];

function RealmCard({ realm, idx }: { realm: any; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, delay: idx * 0.15, ease: "easeOut" as const }
    }
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
            backgroundColor: "rgba(198, 169, 114, 0.02)" 
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="p-12 border border-[#C6A972]/10 bg-[#0a0a0c]/60 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center gap-8 transition-all duration-500 hover:border-[#C6A972]/50 hover:shadow-[0_0_40px_rgba(198,169,114,0.06)] relative overflow-hidden rounded-sm cursor-pointer"
        >
          {/* Lớp phủ vệt sáng tinh vân vàng khi hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#C6A972]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Icon Khung Tròn Thần Thánh Cổ Kính */}
          <div className="p-5 border border-[#C6A972]/15 bg-black/50 text-[#C6A972]/40 rounded-full group-hover:text-[#C6A972] group-hover:border-[#C6A972]/40 group-hover:shadow-[0_0_20px_rgba(198,169,114,0.15)] transition-all duration-500 shrink-0 transform group-hover:rotate-12">
            {realm.icon}
          </div>
          
          <div className="space-y-2">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-[#E8E0D0] tracking-widest group-hover:text-[#C6A972] transition-colors duration-300 font-medium">
              {realm.name}
            </h2>
            <p className="text-[11px] leading-relaxed opacity-40 text-[#E8E0D0]/80 group-hover:opacity-70 transition-opacity duration-300 font-light tracking-wide max-w-md">
              {realm.desc}
            </p>
          </div>

          {/* Dấu định vị tinh tế góc phải card */}
          <div className="absolute bottom-4 right-4 text-[9px] tracking-widest text-[#C6A972]/10 uppercase font-mono group-hover:text-[#C6A972]/30 transition-colors duration-300">
            [ Khám Phá ]
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function CoiGioiPage() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-[#C6A972] pt-40 px-6 overflow-x-hidden selection:bg-[#C6A972]/10 selection:text-[#C6A972]">
      <Navbar />
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0d0d11] to-[#050505] opacity-95" />
      
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(198,169,114,0.03)_0%,transparent_60%)]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        <header className="text-center mb-28 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="inline-block"
          >
            <Compass className="mx-auto opacity-40 text-[#C6A972] animate-[spin_120s_linear_infinite]" size={44} />
          </motion.div>
          
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.8em] text-[#C6A972]/40 uppercase block font-bold">
              Bản Đồ Thần Thoại Linh Nam
            </span>
            <h1 className="font-[family-name:var(--font-cormorant)] text-6xl md:text-7xl mb-4 tracking-[0.25em] font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#E8E0D0] to-[#C6A972]">
              LỤC GIỚI
            </h1>
          </div>
          
          <div className="w-16 h-[1px] bg-[#C6A972]/20 mx-auto" />
        </header>

        {/* --- GRID MẠNG LƯỚI CÕI GIỚI --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
          {realms.map((realm, idx) => (
            <RealmCard realm={realm} key={realm.name} idx={idx} />
          ))}
        </div>

        {/* --- BỘ ĐỊNH VỊ CHƯƠNG --- */}
        <footer className="w-full text-center pb-16 opacity-30 border-t border-[#C6A972]/5 pt-12">
          <p className="text-[9px] uppercase tracking-[0.6em] text-[#E8E0D0]">
            Kỳ Thư Địa Lý • Phân Định Biên Giới Linh Hồn
          </p>
        </footer>
        
      </div>
    </main>
  );
}