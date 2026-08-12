"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  Mountain,
  Waves,
  Feather,
  Map,
  Compass,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";

export default function SonHaiPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBeast, setActiveBeast] = useState(0);

  const [particles] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      initialX: Math.random() * 100,
      animateXStart: Math.random() * 100,
      animateXEnd: Math.random() * 90,
      scale: Math.random() * 0.8 + 0.4,
      duration: Math.random() * 20 + 15,
      size: Math.random() * 5 + 3,
    })),
  );

  const { scrollYProgress } = useScroll();

  const textY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/son-hai.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => console.log("Trình duyệt chặn phát tự động"));
    }
  };

  const mythicalCreatures = [
    {
      name: "Giao Long",
      title: "Bá Chủ Thủy Vực",
      desc: "Ngự trị nơi vực nước sâu cuộn sóng bạt ngàn, mang trong mình tà lực điều khiển dông bão, sấm chớp và những đợt thủy triều nhấn chìm lục địa.",
      icon: <Waves size={22} />,
      color: "from-[#00BFFF]/20 to-transparent",
      glow: "shadow-[0_0_30px_rgba(0,191,255,0.2)]",
    },
    {
      name: "Cửu Vĩ",
      title: "Thiên Hồ Thần Bí",
      desc: "Linh hồ ngàn năm ẩn mình nơi lõi rừng già sương phủ, xảo quyệt vô biên, nắm giữ cấm thuật huyễn hoặc thao túng tâm trí lữ khách.",
      icon: <Feather size={22} />,
      color: "from-[#FF1493]/15 to-transparent",
      glow: "shadow-[0_0_30px_rgba(255,20,147,0.15)]",
    },
    {
      name: "Hổ Thần",
      title: "Kim Miêu Trấn Sơn",
      desc: "Chúa tể sơn lâm vằn vện ánh hoàng kim, mỗi tiếng gầm làm rung chuyển đại ngàn viễn cổ, gánh vác sứ mệnh trấn giữ phong ấn thượng cổ.",
      icon: <Mountain size={22} />,
      color: "from-[#FFD700]/15 to-transparent",
      glow: "shadow-[0_0_30px_rgba(255,215,0,0.15)]",
    },
    {
      name: "Xà Linh",
      title: "Đại Ngàn Thần Xà",
      desc: "Hắc xà vạn năm cuộn mình dưới mạch địa long cổ thụ, mang nọc độc hủy thiên diệt địa nhưng sở hữu sự thông thái từ thủa sơ khai.",
      icon: <Map size={22} />,
      color: "from-[#00E676]/20 to-transparent",
      glow: "shadow-[0_0_30px_rgba(0,230,118,0.2)]",
    },
  ];

  const textVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <main className="relative min-h-screen bg-[#021812] text-[#E8E0D0] overflow-x-hidden selection:bg-[#00E676]/20 selection:text-[#00E676]">
      <Navbar />

      {/* Âm thanh nổi - Thiết kế viền huỳnh quang sinh học */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-10 right-10 z-50 p-4 rounded-full border border-[#00E676]/20 bg-[#021812]/90 text-[#00E676] hover:bg-[#00E676]/10 hover:border-[#00E676] hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(0,230,118,0.1)]"
      >
        {isPlaying ? (
          <Volume2 size={20} className="animate-pulse" />
        ) : (
          <VolumeX size={20} className="opacity-40" />
        )}
      </button>

      {/* --- LAYER NỀN ĐỘNG (BIO-LUMINESCENT EFFECTS) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#021812] via-[#011411] to-[#010912] opacity-95" />

        <motion.img
          src="/images/realms/son-hai.png"
          style={{ scale: bgScale }}
          className="absolute inset-0 h-full w-full object-cover opacity-[0.12] grayscale contrast-125 mix-blend-screen"
          alt="Son Hai Epic Grid"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        {/* Đom đóm rừng sâu trôi nổi ma mị */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-[#00E676]/40 rounded-full blur-[2px]"
            initial={{
              y: "110vh",
              x: `${particle.initialX}vw`,
              scale: particle.scale,
            }}
            animate={{
              y: "-10vh",
              x: [
                `${particle.animateXStart}vw`,
                `${particle.animateXEnd}vw`,
              ],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>

      {/* --- HERO CINEMATIC THEO PHONG CÁCH CUỘN THƯ --- */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <Link
          href="/coi-gioi"
          className="absolute left-6 md:left-12 top-32 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#00E676]/60 hover:text-white transition-colors duration-300 group"
        >
          <ChevronLeft
            size={14}
            className="transform group-hover:-translate-x-1 transition-transform"
          />
          Rời khỏi đại ngàn
        </Link>

        <motion.div
          style={{ y: textY }}
          className="text-center space-y-6 max-w-4xl"
        >
          <span className="text-[#00E676] tracking-[1.2em] uppercase text-[9px] font-bold block drop-shadow-[0_0_15px_rgba(0,230,118,0.3)]">
            SƠN HẢI KỲ THƯ
          </span>

          <h1 className="font-[family-name:var(--font-cormorant)] text-7xl md:text-[11rem] leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#E8E0D0] via-[#00E676]/80 to-[#00BFFF]/60 font-black tracking-widest select-none">
            SƠN HẢI
          </h1>

          <p className="text-xs md:text-sm tracking-[0.5em] uppercase text-[#E8E0D0]/40 font-light max-w-xl mx-auto leading-relaxed">
            Vùng Đất Của Những Linh Thú Biến Dị & Dị Cảnh Thuở Hồng Hoang
          </p>
        </motion.div>

        <div className="absolute bottom-16 flex flex-col items-center gap-2 opacity-40">
          <Compass
            size={18}
            className="animate-[spin_40s_linear_infinite] text-[#00E676]"
          />
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#00E676] to-transparent" />
        </div>
      </section>

      {/* --- MỤC KHÁM PHÁ LINH THÚ: GIAO DIỆN TƯƠNG TÁC PHÂN TẦNG --- */}
      <section className="relative z-10 py-40 px-6 max-w-7xl mx-auto border-t border-[#00E676]/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Cột Trái: Trình chọn danh sách thẻ linh thú dọc */}
          <div className="lg:col-span-5 space-y-4">
            <div className="mb-10 space-y-2">
              <span className="text-[10px] tracking-[0.3em] text-[#00BFFF] uppercase block font-semibold">
                Địa long dị tộc
              </span>

              <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-[#E8E0D0] tracking-wide">
                Bốn Đại Linh Thú
              </h2>
            </div>

            <div className="space-y-3">
              {mythicalCreatures.map((creature, idx) => (
                <button
                  key={creature.name}
                  onClick={() => setActiveBeast(idx)}
                  className={`w-full text-left p-6 border transition-all duration-500 rounded-sm flex items-center justify-between group relative overflow-hidden ${
                    activeBeast === idx
                      ? "border-[#00E676] bg-[#011a14]/60 shadow-[0_0_30px_rgba(0,230,118,0.05)]"
                      : "border-[#00E676]/10 bg-black/30 hover:border-[#00E676]/40"
                  }`}
                >
                  <div className="flex items-center gap-6 relative z-10">
                    <span
                      className={`text-xs font-mono transition-colors duration-300 ${
                        activeBeast === idx
                          ? "text-[#00E676]"
                          : "text-[#E8E0D0]/30"
                      }`}
                    >
                      0{idx + 1}
                    </span>

                    <div>
                      <h3
                        className={`font-[family-name:var(--font-cormorant)] text-2xl transition-colors duration-300 ${
                          activeBeast === idx
                            ? "text-[#00E676]"
                            : "text-[#E8E0D0]/70 group-hover:text-white"
                        }`}
                      >
                        {creature.name}
                      </h3>

                      <p className="text-[9px] tracking-widest text-[#E8E0D0]/30 uppercase group-hover:text-[#E8E0D0]/50 transition-colors">
                        {creature.title}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-500 ${
                      activeBeast === idx
                        ? "text-[#00E676] scale-110"
                        : "text-[#E8E0D0]/20 group-hover:text-[#00E676]/50"
                    }`}
                  >
                    {creature.icon}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 h-[420px] bg-[#01120e]/60 border border-[#00E676]/10 p-12 relative overflow-hidden flex flex-col justify-between rounded-sm backdrop-blur-sm">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${mythicalCreatures[activeBeast].color} opacity-40 transition-all duration-700`}
            />

            <div
              className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] bg-current opacity-10 transition-all duration-700 ${mythicalCreatures[activeBeast].glow}`}
            />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-3 px-3 py-1 border border-[#00E676]/20 bg-black/40 rounded-full text-[9px] uppercase tracking-widest text-[#00E676]">
                <Eye size={10} /> Thần Thú Kỳ Bản
              </div>

              <div className="space-y-2">
                <h2 className="font-[family-name:var(--font-cormorant)] text-5xl text-[#E8E0D0] tracking-widest">
                  {mythicalCreatures[activeBeast].name}
                </h2>

                <p className="text-xs text-[#00BFFF] uppercase tracking-[0.3em] font-medium">
                  — {mythicalCreatures[activeBeast].title}
                </p>
              </div>

              <p className="text-[#E8E0D0]/60 text-sm leading-[2.2] font-light italic tracking-wide max-w-xl transition-all duration-500">
                &quot;{mythicalCreatures[activeBeast].desc}&quot;
              </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-[#00E676]/5 flex justify-between items-center text-[9px] tracking-widest text-[#E8E0D0]/30 uppercase font-mono">
              <span>Trạng thái: Đang ẩn mình</span>
              <span>Linh Nam Chi Tiết Quyển</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-40 px-6 max-w-7xl mx-auto border-t border-[#00E676]/5 bg-gradient-to-b from-transparent via-[#01140f]/40 to-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <motion.div
            variants={textVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 md:p-8"
          >
            <span className="text-[#00BFFF] text-[10px] tracking-[0.5em] uppercase font-bold block">
              Khởi nguồn tổ tiên
            </span>

            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl text-[#E8E0D0] tracking-wider">
              Linh Sơn & Cổ Tự
            </h2>

            <p className="text-sm text-[#E8E0D0]/50 leading-[2.2] font-light tracking-wide">
              Những ngọn núi khổng lồ đột ngột nhô lên tột cùng ranh giới từ
              những tầng mây độc mờ mịt, nối liền mạch sống giữa trời và đất.
              Nơi đỉnh non cao rêu phong phủ lối là các cổ tự hoang tàn rùng
              lạnh, địa điểm chôn giấu những lớp thạch trận phức tạp từ thuở
              hồng hoang nhằm kìm hãm hung lực cổ xưa trỗi dậy.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#00E676]/80 font-mono tracking-widest">
              <div className="flex items-center gap-2">
                ✦ Chinh phục Linh Sơn
              </div>

              <div className="flex items-center gap-2">
                ✦ Giải mã trận Cổ Tự
              </div>

              <div className="flex items-center gap-2 col-span-2">
                ✦ Gia cố Mạch Phong Ấn Địa Long
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={textVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 md:p-8 border-l border-[#00E676]/10 md:pl-16"
          >
            <span className="text-[#00E676] text-[10px] tracking-[0.5em] uppercase font-bold block">
              Vùng địa cực vô danh
            </span>

            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl text-[#E8E0D0] tracking-wider">
              Bí Cảnh Lãng Quên
            </h2>

            <p className="text-sm text-[#E8E0D0]/50 leading-[2.2] font-light tracking-wide">
              Tồn tại cô độc ngoài rìa của những tấm bản đồ lục giới, đó là hệ
              thống hòn đảo đá treo lơ lửng giữa biển mây mù hoặc thung lũng
              sâu thẳm đầy chướng khí. Chỉ những kẻ can trường, mang ý chí sắt
              đá nhất mới dám đặt chân vào để săn lùng mảnh vỡ sức mạnh của
              thần linh cổ đại.
            </p>

            <div className="h-[1px] w-full bg-gradient-to-r from-[#00E676]/20 to-transparent my-6" />

            <h4 className="text-md font-[family-name:var(--font-cormorant)] text-[#00BFFF] tracking-widest">
              Kẻ Khai Phá Vô Danh
            </h4>

            <p className="text-xs text-[#E8E0D0]/40 leading-relaxed italic font-light">
              &quot;Thợ săn dị thú, lữ khách cô độc hành hương, hay những đạo
              sĩ truy cầu sức mạnh nguyên thủy tối cao. Bọn họ bước vào đây đều
              hiểu rằng nơi này chính là mộ chôn của những huyền thoại.&quot;
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 py-24 text-center border-t border-[#00E676]/5 bg-black/40">
        <p className="text-[10px] uppercase tracking-[1em] text-[#00E676]/40 font-semibold">
          Chương II: Sơn Hải Bạt Ngàn • Linh Nam Sử Thi
        </p>
      </footer>
    </main>
  );
}