"use client";

import { Transition } from "@headlessui/react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect } from "react";
import { MdBrowserUpdated } from "react-icons/md";

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
    <div className="fixed top-0 right-0 p-2 z-50">
      <Transition
        appear
        show={mutating > 0}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <MdBrowserUpdated />
      </Transition>
    </div>
  );
};
