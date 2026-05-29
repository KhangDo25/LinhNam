"use client";

import { notFound } from "next/navigation";
import RealmLayout from "@/components/layout/realm-layout";
import CreaturesSection from "@/sections/realm/creatures-section";
import ArtifactsSection from "@/sections/realm/artifacts-section";
import LoreSection from "@/sections/realm/lore-section";
import { getRealmBySlug } from "@/data/realms";
import { getCreaturesByRealm } from "@/data/creatures";
import { getArtifactsByRealm } from "@/data/artifacts";
import { getLoreByRealm } from "@/data/lore";

interface RealmPageProps {
  slug: string;
}

export default function RealmPage({ slug }: RealmPageProps) {
  const realm = getRealmBySlug(slug);
  if (!realm) notFound();

  const realmCreatures = getCreaturesByRealm(slug);
  const realmArtifacts = getArtifactsByRealm(slug);
  const realmLore = getLoreByRealm(slug);

  return (
    <RealmLayout realm={realm}>
      <LoreSection realm={realm} entries={realmLore} />
      <CreaturesSection realm={realm} creatures={realmCreatures} />
      <ArtifactsSection realm={realm} artifacts={realmArtifacts} />
    </RealmLayout>
  );
}
