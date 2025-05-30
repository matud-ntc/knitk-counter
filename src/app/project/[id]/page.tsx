// src/app/project/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import SectionSelector from "@/components/project/SectionSelector";
import SectionProgress from "@/components/project/SectionProgress";
import SectionClientControls from "@/components/project/SectionClientControls";
import { notFound } from "next/navigation";
import { finishProject } from "@/lib/actions/projectActions";
import Button from "@/components/ui/Button";
import ThemeHydration from "@/components/ui/ThemeHydration"; // 👈 Importante

export default async function Page(props: any) {
  const { params, searchParams } = props;

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

  return (
    <main className="flex flex-col min-h-screen px-4 pb-6 pt-8 max-w-md mx-auto">
      <ThemeHydration /> {/* 👈 Aplica el tema en el cliente */}
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
      />
      <div className="mt-10 mb-10">
        <SectionProgress section={section} />
      </div>
      <div className="flex-grow flex flex-col justify-center">
        <SectionClientControls
          sectionId={section.id}
          revalidatePath={`/project/${params.id}`}
          initialRowCount={section.completedRows}
        />
      </div>
      {!project.isFinished && (
        <form
          action={async () => {
            "use server";
            await finishProject(project.id, "/");
          }}
          className="mt-10"
        >
          <Button variant="secondary" className="w-full">
            Finalizar proyecto
          </Button>
        </form>
      )}
    </main>
  );
}
