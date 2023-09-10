import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { trpc } from "@/util/trpc/trpc";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CommandMenu = ({ newProject }: { newProject: () => void }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const pathname = usePathname();
  const { setTheme } = useTheme();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const { data: projects } = trpc.projects.list.useQuery(undefined, {
    enabled: open,
    refetchInterval: 300_000,
  });
  const router = useRouter();

  const goto = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => goto("/profile")}>Profile</CommandItem>
          <CommandItem onSelect={() => goto("/projects")}>Projects</CommandItem>
          <CommandItem onSelect={() => goto("/tasks")}>Tasks</CommandItem>
          <CommandItem onSelect={() => goto("/completed")}>
            Completed
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Projects">
          {projects?.map((project) => (
            <CommandItem
              key={project.id}
              onSelect={() => goto(`/project/${project.id}`)}
            >
              {project.name}
            </CommandItem>
          ))}
          <CommandItem
            onSelect={() => {
              setOpen(false);
              newProject();
            }}
          >
            New Project
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Theme">
          <CommandItem
            onSelect={() => {
              setTheme("light");
              setOpen(false);
            }}
          >
            <Sun />
            Light Theme
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setTheme("dark");
              setOpen(false);
            }}
          >
            <Moon />
            Dark Theme
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setTheme("system");
              setOpen(false);
            }}
          >
            <Sun className="dark:hidden" />
            <Moon className="hidden dark:block" />
            System Theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
