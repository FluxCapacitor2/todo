import { Button } from "@/components/ui/Button";
import { PillButton } from "@/components/ui/PillButton";
import { Skeleton } from "../(sidebar)/[view]/[id]/project";

export default function Page() {
  return (
    <>
      <div className="relative z-10" role="dialog" aria-modal="true">
        <div className="fixed inset-0 -z-50 hidden bg-black/40 opacity-100 md:block"></div>
        <div className="fixed inset-0 m-auto h-max w-max scale-100 overflow-y-auto rounded-lg opacity-100">
          <div className="flex items-center justify-center">
            <div className="flex w-full flex-col overflow-y-scroll bg-white p-12 dark:bg-gray-900">
              <h2 className="text-3xl font-extrabold">Signed Out</h2>
              <p>You must be signed in to view this project.</p>
              <hr className="mb-2 mt-4" />
              <div className="flex justify-end">
                <Button variant="primary">Sign In</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="px-2 pt-4 md:px-6">
        <div className="my-1 h-8 w-48 animate-pulse rounded-md bg-gray-500/50" />
        <div className="flex">
          <PillButton href={`/`} active={false}>
            Project
          </PillButton>
          <PillButton href={`/`} active={false}>
            List
          </PillButton>
          <PillButton href={`/`} active={false}>
            Calendar
          </PillButton>
        </div>
        {Skeleton}
      </main>
    </>
  );
}
