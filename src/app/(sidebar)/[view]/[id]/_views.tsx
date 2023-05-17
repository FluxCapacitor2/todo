import { notFound } from "next/navigation";
import { ReactElement } from "react";
import { CalendarView } from "./calendar";
import { ListView } from "./list";
import { ProjectView } from "./project";

const components: Record<string, ({ id }: { id: string }) => ReactElement> = {
  project: ProjectView,
  list: ListView,
  calendar: CalendarView,
};

export function getView(view: string, id: string) {
  const Component = components[view];

  if (!Component) {
    notFound();
  }

  return (
    <>
      <Component id={id} />
    </>
  );
}
