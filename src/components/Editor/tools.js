import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Code from "@editorjs/code";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Underline from "@editorjs/underline";
import Table from "@editorjs/table";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import Raw from "@editorjs/raw";
import Attaches from "@editorjs/attaches";
import ImageTool from "@editorjs/image";
import TextVariantTune from "@editorjs/text-variant-tune";

const EDITOR_JS_TOOLS = {
  header: Header,
  list: List,
  checklist: Checklist,
  code: Code,
  quote: Quote,
  marker: Marker,
  underline: Underline,
  table: Table,
  inlineCode: InlineCode,
  linkTool: LinkTool,
  embed: Embed,
  raw: Raw,
  attaches: Attaches,
  image: ImageTool,
  textVariant: TextVariantTune,
};

export default EDITOR_JS_TOOLS;
