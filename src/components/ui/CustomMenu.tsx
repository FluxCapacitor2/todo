import { autoUpdate, flip, useFloating } from "@floating-ui/react-dom";
import { Menu, Portal } from "@headlessui/react";
import { PropsWithChildren, ReactNode } from "react";
import { MdClose } from "react-icons/md";

export const MenuItems = ({
  children,
  button,
  open,
  close,
}: PropsWithChildren<{
  button: ReactNode;
  open: boolean;
  close: () => void;
}>) => {
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [flip()],
    whileElementsMounted: autoUpdate,
  });

  return (
    <>
      <div ref={refs.setReference}>{button}</div>
      <Portal>
        <Menu.Items
          ref={refs.setFloating}
          style={floatingStyles}
          className="relative divide-y divide-gray-100 overflow-hidden rounded-md bg-gray-100 shadow-lg focus:outline-none dark:divide-gray-600 dark:bg-gray-800"
        >
          {children}
          <MenuItem>
            <MdClose /> Close
          </MenuItem>
        </Menu.Items>
      </Portal>
    </>
  );
};

export const MenuItem = (
  props: PropsWithChildren<{ onClick?: () => void }>
) => {
  const { children, onClick } = props;

  return (
    <Menu.Item
      as="div"
      className="flex cursor-pointer select-none items-center gap-2 whitespace-nowrap p-2 transition-colors hover:bg-gray-200 dark:hover:bg-white/10"
      onClick={onClick}
    >
      {children}
    </Menu.Item>
  );
};
