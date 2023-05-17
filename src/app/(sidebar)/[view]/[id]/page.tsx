import { getView } from "./_views";

export default function Page({
  params: { view, id },
}: {
  params: { view: string; id: string };
}) {
  return getView(view, id);
}
