import { prisma } from "@/lib/prisma";
import SectionSelector from "@/components/project/SectionSelector";
import SectionProgress from "@/components/project/SectionProgress";
import SectionClientControls from "@/components/project/SectionClientControls";
import { notFound } from "next/navigation";

// Add this to help Next.js understand your dynamic route
export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    select: { id: true }
  });
  return projects.map((project) => ({ id: project.id }));
}

// Use this type for your props
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ProjectPage({ params, searchParams }: Props) {
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
    <main className="p-4 max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-2">
        {project.name}
      </h1>

      <SectionSelector sections={project.sections} currentId={section.id} />
      <SectionProgress section={section} />
      <SectionClientControls
        sectionId={section.id}
        revalidatePath={`/project/${params.id}`}
        initialStitchCount={section.completedStitches}
      />
    </main>
  );
}