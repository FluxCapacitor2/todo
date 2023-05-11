import "remirror/styles/all.css";
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
import { Remirror, useRemirror } from "@remirror/react";

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
          "!outline-none",
          "border",
          "border-transparent",
          "focus:border-gray-600",
          "dark:focus:border-gray-400",
          "px-4",
          "-py-4",
          "rounded-lg",
        ]}
      />
    </div>
  );
};
