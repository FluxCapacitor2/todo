import { Remirror, useRemirror } from "@remirror/react";
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
  initialContent,
  setContent,
  editable = true,
}: {
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

  const save = async () => {
    const markdown = getContext()!.helpers.getMarkdown();
    setContent(markdown);
  };

  return (
    <div className="prose dark:prose-invert">
      <Remirror
        editable={editable}
        manager={manager}
        initialContent={state}
        onBlur={save}
        classNames={[
          "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        ]}
      />
    </div>
  );
};
