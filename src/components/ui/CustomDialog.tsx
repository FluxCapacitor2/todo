import { Dialog, Transition } from "@headlessui/react";
import { Fragment, PropsWithChildren, ReactNode } from "react";

export const CustomDialog = ({
  opened,
  close,
  children,
}: PropsWithChildren<{
  opened: boolean;
  close: () => void;
}>) => {
  return (
    <Transition appear show={opened} as={Fragment}>
      <Dialog onClose={close} className="fixed inset-0 md:relative z-10">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="hidden md:block fixed inset-0 -z-50 bg-black/40" />
        </Transition.Child>
        <Transition.Child
          as="div"
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-x-4"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 translate-x-4"
        >
          <div className="fixed inset-y-0 w-screen md:w-1/3 md:min-w-[42rem] right-0 overflow-y-auto">
            <div className="flex items-center justify-center">
              <Dialog.Panel className="w-full min-h-screen overflow-y-scroll bg-white dark:bg-gray-900 p-8">
                {children}
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export const DialogTitle = ({ children }: { children: ReactNode }) => (
  <Dialog.Title className="text-3xl font-extrabold mb-4 flex items-center gap-2">
    {children}
  </Dialog.Title>
);
