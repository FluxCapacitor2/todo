import { cn } from "@/lib/utils";
import { Remirror, useRemirror } from "@remirror/react";
import { useEffect } from "react";
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeBlockExtension,
  CodeExtension,
  EmojiExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  MarkdownExtension,
  OrderedListExtension,
  PlaceholderExtension,
  UnderlineExtension,
} from "remirror/extensions";
import "remirror/styles/all.css";

export const RemirrorEditor = ({
  className,
  initialContent,
  setContent,
  editable = true,
}: {
  className?: string;
  initialContent: string;
  setContent: (content: string) => void;
  editable: boolean;
}) => {
  const { manager, state, getContext } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new BlockquoteExtension(),
      new CodeBlockExtension(),
      new CodeExtension(),
      new EmojiExtension(),
      new LinkExtension(),
      new MarkdownExtension(),
      new PlaceholderExtension({
        placeholder: "Click to add a description...",
      }),
      new UnderlineExtension(),
      new BulletListExtension(),
      new OrderedListExtension(),
      new HeadingExtension(),
    ],
    content: initialContent,
    stringHandler: "markdown",
  });

  useEffect(() => {
    getContext()!.setContent(initialContent);
  }, [initialContent]);

  const save = async () => {
    const markdown = getContext()!.helpers.getMarkdown();
    setContent(markdown);
  };

  return (
    <div className={cn("prose dark:prose-invert", className)}>
      <Remirror
        editable={editable}
        manager={manager}
        initialContent={state}
        onBlur={save}
        classNames={[
          "w-full rounded-md !overflow-y-auto border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        ]}
      />
    </div>
  );
};
