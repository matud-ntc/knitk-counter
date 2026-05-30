// src/app/project/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import SectionSelector from "@/components/project/SectionSelector";
import SectionProgress from "@/components/project/SectionProgress";
import SectionClientControls from "@/components/project/SectionClientControls";
import ProjectNotes from "@/components/project/ProjectNotes";
import FinishButton from "@/components/project/FinishButton";
import { notFound } from "next/navigation";
import ThemeHydration from "@/components/ui/ThemeHydration";

export default async function Page(props: any) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { sections: true },
  });

  if (!project) return notFound();
  if (project.sections.length === 0)
    return <p>Este proyecto no tiene secciones.</p>;

  const currentSectionId =
    typeof searchParams?.section === "string"
      ? searchParams.section
      : project.sections[0].id;

  const section = project.sections.find((s) => s.id === currentSectionId);
  if (!section) return notFound();

  const revalidatePath = `/project/${params.id}`;

  return (
    <main className="flex flex-col min-h-screen px-4 pb-6 pt-8 max-w-md mx-auto">
      <ThemeHydration />
      <h1 className="text-3xl font-bold text-center text-[var(--color-primary)] mb-4">
        {project.name}
      </h1>
      <SectionSelector
        projectId={project.id}
        sections={project.sections.map((s) => ({
          ...s,
          totalRows: s.totalRows ?? undefined,
        }))}
        currentId={section.id}
        revalidatePath={revalidatePath}
      />
      <div className="mt-10 mb-10">
        <SectionProgress section={section} />
      </div>
      <div className="flex-grow flex flex-col justify-center">
        <SectionClientControls
          sectionId={section.id}
          revalidatePath={revalidatePath}
          initialRowCount={section.completedRows}
        />
      </div>

      <div className="mt-12 mb-4">
        <ProjectNotes sectionId={section.id} revalidatePath={revalidatePath} initialNotes={section.notes} />
      </div>

      {!project.isFinished && (
        <FinishButton projectId={project.id} />
      )}
    </main>
  );
}
