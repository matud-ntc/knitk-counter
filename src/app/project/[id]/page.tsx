import { prisma } from "@/lib/prisma";
import SectionSelector from "@/components/project/SectionSelector";
import SectionProgress from "@/components/project/SectionProgress";
import SectionClientControls from "@/components/project/SectionClientControls";
import { notFound } from "next/navigation";

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
    <main className="flex flex-col min-h-screen px-4 pb-6 max-w-md mx-auto">
      <header className="pt-6 pb-4">
        <h1 className="text-3xl font-bold text-center text-pink-600">
          {project.name}
        </h1>
        <SectionSelector sections={project.sections} currentId={section.id} />
      </header>

      <div className="flex-grow flex flex-col justify-center">
        <SectionClientControls
          sectionId={section.id}
          revalidatePath={`/project/${params.id}`}
          initialStitchCount={section.completedStitches}
        />
      </div>

      <footer className="mt-auto pt-4">
        <SectionProgress section={section} />
      </footer>
    </main>
  );
}
