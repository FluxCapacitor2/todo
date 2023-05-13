import { Dialog, Transition } from "@headlessui/react";
import {
  Fragment,
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
} from "react";

export const CustomDialog = ({
  opened,
  close,
  children,
  initialFocus,
}: PropsWithChildren<{
  opened: boolean;
  close: () => void;
  initialFocus?: MutableRefObject<HTMLElement | null>;
}>) => {
  return (
    <Transition appear show={opened} as={Fragment}>
      <Dialog
        onClose={close}
        className="relative z-10"
        initialFocus={initialFocus}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 -z-50 hidden bg-black/40 md:block" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-x-4"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 translate-x-4"
        >
          <div className="fixed inset-y-0 right-0 w-screen overflow-y-auto md:w-1/3 md:min-w-[42rem]">
            <div className="flex items-center justify-center">
              <Dialog.Panel className="min-h-screen w-full overflow-y-scroll bg-white p-8 dark:bg-gray-900">
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
  <Dialog.Title className="mb-4 flex items-center gap-2 text-3xl font-extrabold">
    {children}
  </Dialog.Title>
);
