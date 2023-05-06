import { getProject } from "../layout";
import { CalendarPage } from "./CalendarPage";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const project = await getProject(id);
  return <CalendarPage project={project} />;
}
