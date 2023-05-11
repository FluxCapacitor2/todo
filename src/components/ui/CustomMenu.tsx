import { Menu, Transition } from "@headlessui/react";
import { Fragment, PropsWithChildren } from "react";
import { MdClose } from "react-icons/md";

export const MenuItems = (props: PropsWithChildren<{}>) => {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="z-10 absolute origin-top-right divide-y divide-gray-100 dark:divide-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 shadow-lg focus:outline-none overflow-hidden">
        {props.children}
        <MenuItem>
          <MdClose /> Close
        </MenuItem>
      </Menu.Items>
    </Transition>
  );
};

export const MenuItem = (
  props: PropsWithChildren<{ onClick?: () => void }>
) => {
  const { children, onClick } = props;

  return (
    <Menu.Item
      as="div"
      className="hover:bg-gray-200 dark:hover:bg-white/10 flex gap-2 items-center p-2 transition-colors cursor-pointer select-none whitespace-nowrap"
      onClick={onClick}
    >
      {children}
    </Menu.Item>
  );
};
