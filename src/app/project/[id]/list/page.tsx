import { getProject } from "../layout";
import { ListPage } from "./ListPage";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const project = await getProject(id);
  return <ListPage project={project} />;
}
