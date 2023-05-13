"use client";

import { Transition } from "@headlessui/react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect } from "react";
import { MdBrowserUpdated, MdRefresh } from "react-icons/md";

export const FetchingIndicators = () => {
  const fetching = useIsFetching();
  const mutating = useIsMutating();

  useEffect(() => {
    if (mutating > 0) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  }, [mutating]);

  return (
    <div className="fixed right-0 top-0 z-50 flex justify-end gap-2 p-2">
      <Transition
        appear
        show={mutating > 0}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="animate-bounce"
      >
        <MdBrowserUpdated />
      </Transition>
      <Transition
        appear
        show={fetching > 0}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="animate-spin"
      >
        <MdRefresh />
      </Transition>
    </div>
  );
};
