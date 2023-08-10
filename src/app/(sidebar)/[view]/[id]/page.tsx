import { getView } from "./_views";

import { components } from "./_views";

export const generateStaticParams = () => {
  return Object.keys(components).map((view) => ({ view }));
};

export default function Page({
  params: { view, id },
}: {
  params: { view: string; id: string };
}) {
  return getView(view, id);
}
