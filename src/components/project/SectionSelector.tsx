"use client";

import SectionSelect from "@/components/ui/SectionSelect";

type Section = {
  id: string;
  name: string;
};

type Props = {
  sections: Section[];
  currentId: string;
};

export default function SectionSelector({ sections, currentId }: Props) {
  return <SectionSelect options={sections} currentId={currentId} />;
}
