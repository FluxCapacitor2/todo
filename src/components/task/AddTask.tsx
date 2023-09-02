import { Button } from "@/components/ui/button";
import { useCreateSubtask, useCreateTask } from "@/hooks/task";
import { cn, shortDateFormat } from "@/lib/utils";
import { trpc } from "@/util/trpc/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { PopoverClose } from "@radix-ui/react-popover";
import { isAfter } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAdd, MdCancel, MdSend } from "react-icons/md";
import { z } from "zod";
import { DatePickerPopover } from "../ui/DatePickerPopover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export const AddSectionTask = ({
  sectionId,
  projectId,
}: {
  sectionId?: number;
  projectId: string;
}) => {
  const { createTask } = useCreateTask(projectId);

  return (
    <AddTask
      projectId={projectId}
      section={sectionId}
      onAdd={({ name, description, sectionId, dueDate }) =>
        createTask({ name, description, sectionId: sectionId!, dueDate })
      }
    />
  );
};

export const AddSubtask = ({
  projectId,
  parentTaskId,
}: {
  projectId: string;
  parentTaskId: number;
}) => {
  const { createSubtask } = useCreateSubtask(projectId, parentTaskId);

  return (
    <AddTask
      sectionEditable={false}
      projectId={projectId}
      onAdd={({ name, description, dueDate }) =>
        createSubtask({
          id: parentTaskId,
          name,
          description,
          dueDate,
        })
      }
    />
  );
};

const FormSchema = (sectionEditable: boolean) =>
  z.object({
    name: z
      .string()
      .nonempty("You must add a name!")
      .max(512, "Name is too long!"),
    description: z.string().max(1024, "Description is too long!"),
    sectionId: sectionEditable
      ? z.coerce
          .number({ invalid_type_error: "You must select a section!" })
          .nonnegative()
      : z.optional(z.any()),
  });

const AddTask = ({
  onAdd,
  projectId,
  section: defaultSection,
  sectionEditable = true,
}: {
  onAdd: ({
    name,
    description,
    sectionId,
    dueDate,
  }: {
    name: string;
    description: string;
    sectionId: number | null;
    dueDate: Date | null;
  }) => Promise<void>;
  projectId: string;
  section?: number;
  sectionEditable?: boolean;
}) => {
  const { data, isLoading, isError } = trpc.projects.get.useQuery(projectId, {
    refetchInterval: 60_000,
  });

  const [popoverShown, setPopoverShown] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const newTask = async ({
    name,
    description,
    sectionId,
  }: z.infer<ReturnType<typeof FormSchema>>) => {
    onAdd({
      name,
      description,
      sectionId: sectionEditable ? sectionId! : null,
      dueDate,
    });
    reset();
    setPopoverShown(false);
  };

  const form = useForm<z.infer<ReturnType<typeof FormSchema>>>({
    resolver: zodResolver(FormSchema(sectionEditable)),
    defaultValues: {
      name: "",
      description: "",
      sectionId: defaultSection,
    },
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const reset = () => {
    form.reset();
    setDueDate(null);
  };

  return (
    <Popover
      open={popoverShown}
      onOpenChange={(open) => {
        if (!open) reset();
        setPopoverShown(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MdAdd />
          Add Task
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-80">
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(newTask)}
            className="flex flex-col gap-2"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {sectionEditable && (
              <FormField
                name="sectionId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value?.toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="addTaskSection">
                          <SelectValue placeholder="Choose a section..." />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.sections.map((section) => (
                            <SelectItem
                              key={section.id}
                              value={section.id.toString()}
                            >
                              {section.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="addTaskDescription"
                      onKeyDown={(e) => {
                        if (e.ctrlKey && e.key === "Enter") {
                          formRef.current?.requestSubmit();
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-between gap-2">
              <DatePickerPopover date={dueDate} setDate={setDueDate}>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground",
                    dueDate &&
                      isAfter(new Date(), dueDate) &&
                      "text-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? shortDateFormat(dueDate) : <span>Due date</span>}
                </Button>
              </DatePickerPopover>
              <div className="flex justify-end gap-2">
                <PopoverClose asChild>
                  <Button variant="ghost" onClick={reset} type="button">
                    <MdCancel />
                  </Button>
                </PopoverClose>
                <Button type="submit">
                  <MdSend />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
