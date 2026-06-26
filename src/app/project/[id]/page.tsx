// src/app/project/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import ProjectHeader from "@/components/project/ProjectHeader";
import SectionProgress from "@/components/project/SectionProgress";
import SectionClientControls from "@/components/project/SectionClientControls";
import ProjectNotes from "@/components/project/ProjectNotes";
import { notFound } from "next/navigation";

export default async function Page(props: any) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { sections: true },
  });

  if (!project) return notFound();
  if (project.sections.length === 0)
    return (
      <p className="p-8 text-center text-[var(--muted-fg)]">
        Este proyecto no tiene secciones.
      </p>
    );

  const sections = [...project.sections].sort((a, b) => a.order - b.order);

  const currentSectionId =
    typeof searchParams?.section === "string"
      ? searchParams.section
      : sections[0].id;

  const section = sections.find((s) => s.id === currentSectionId);
  if (!section) return notFound();

  const sectionIndex = sections.findIndex((s) => s.id === section.id);
  const revalidatePath = `/project/${params.id}`;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-6 pt-14">
      <ProjectHeader
        projectId={project.id}
        projectName={project.name}
        sections={sections.map((s) => ({
          id: s.id,
          name: s.name,
          totalRows: s.totalRows ?? undefined,
        }))}
        currentId={section.id}
        sectionIndex={sectionIndex}
        revalidatePath={revalidatePath}
        isFinished={project.isFinished}
      />

      <div className="mt-8">
        <SectionProgress name={section.name} section={section} />
      </div>

      <div className="flex flex-1 flex-col justify-center py-6">
        <SectionClientControls
          key={section.id}
          sectionId={section.id}
          revalidatePath={revalidatePath}
          initialRowCount={section.completedRows}
        />
      </div>

      <ProjectNotes
        key={`notes-${section.id}`}
        sectionId={section.id}
        revalidatePath={revalidatePath}
        initialNotes={section.notes}
      />
    </main>
  );
}
