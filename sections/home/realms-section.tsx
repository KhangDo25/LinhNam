"use client";

import { realms } from "@/data/realms";
import SectionTitle from "@/components/ui/section-title";
import RealmPortalCard from "@/sections/home/realm-portal-card";

export default function RealmsSection() {
  return (
    <section
      id="luc-gioi"
      className="relative z-10 py-24 md:py-48 px-4 sm:px-6 bg-gradient-to-b from-void via-mist/40 to-void scroll-mt-20 cv-auto"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 md:mb-32 flex justify-center">
          <SectionTitle
            eyebrow="Bản đồ cổ sơ"
            title="Lục Giới Linh Nam"
            subtitle="Bốn cõi huyền bí — chạm để vào Thiên Giới, Sơn Hải, Thủy Phủ, U Minh"
          />
        </div>
        <p className="text-center text-sm text-bone/70 max-w-2xl mx-auto mb-16 -mt-8 leading-relaxed">
          Mỗi cõi có trang riêng với sử thi, linh thú và di vật. Nội dung tham chiếu Wikipedia
          tiếng Việt và tài liệu văn hóa công bố.
        </p>

        <div className="flex flex-col gap-24 md:gap-40">
          {realms.map((realm, index) => (
            <RealmPortalCard
              key={realm.slug}
              realm={realm}
              index={index}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
