import React, { useEffect, useRef, useCallback } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import Paragraph from "@editorjs/paragraph";
import Table from "@editorjs/table";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import CodeTool from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";

import Checklist from "@editorjs/checklist";
import Marker from "@editorjs/marker";

const validateEditorContent = (content) => {
  console.log("Validating content:", content);
  if (!content || !content.blocks || !Array.isArray(content.blocks)) {
    console.warn("Invalid content structure, returning empty blocks");
    return { blocks: [], time: Date.now(), version: "2.31.0-rc.7" };
  }

  const validBlocks = content.blocks.filter((block) => {
    if (!block || !block.type || !block.data) {
      console.warn("Block missing required fields:", block);
      return false;
    }

    if (block.type === "paragraph") {
      if (block.data.text === undefined || block.data.text === null) {
        console.warn("Paragraph block has no text field:", block);
        return false;
      }
      if (
        typeof block.data.text === "string" &&
        block.data.text.includes("<")
      ) {
        block.data.text = block.data.text.replace(/<[^>]*>/g, "");
      }
      return true;
    }

    if (block.type === "header") {
      if (!block.data.text || typeof block.data.text !== "string") {
        console.warn("Header block invalid:", block);
        return false;
      }
      if (!block.data.level || block.data.level < 1 || block.data.level > 6) {
        block.data.level = 2;
      }
      return true;
    }

    if (block.type === "list") {
      if (
        !block.data.style ||
        !["ordered", "unordered"].includes(block.data.style)
      ) {
        console.warn("Invalid list style, defaulting to unordered:", block);
        block.data.style = "unordered";
      }
      if (!block.data.items || !Array.isArray(block.data.items)) {
        console.warn("List block has no items or invalid items:", block);
        return false;
      }
      block.data.items = block.data.items.filter(
        (item) => typeof item === "string" && item.trim()
      );
      if (block.data.items.length === 0) {
        console.warn("List block has no valid items:", block);
        return false;
      }
      return true;
    }

    if (block.type === "quote") {
      if (
        block.data.text === undefined ||
        typeof block.data.text !== "string"
      ) {
        console.warn("Quote block invalid:", block);
        return false;
      }
      // allow empty string as valid
      return true;
    }

    if (block.type === "image") {
      if (!block.data.file || !block.data.file.url) {
        console.warn("Image block missing URL:", block);
        return false;
      }
      return true;
    }

    if (block.type === "table") {
      if (!Array.isArray(block.data.content)) {
        console.warn("Table block has invalid content:", block);
        return false;
      }

      // Clean up cells
      block.data.content = block.data.content.map((row) =>
        Array.isArray(row)
          ? row.map((cell) => (typeof cell === "string" ? cell : ""))
          : []
      );

      // During live editing: allow empty table
      if (!block.data.content.length) {
        return true;
      }

      // If all rows are completely empty, treat it as invalid (but maybe only at final save)
      if (
        block.data.content.every((row) => row.every((cell) => !cell.trim()))
      ) {
        console.warn("Table block has no valid rows:", block);
        return false;
      }

      return true;
    }

    if (block.type === "linkTool") {
      if (!block.data.link || typeof block.data.link !== "string") {
        console.warn("LinkTool block missing or invalid link:", block);
        return false;
      }
      return true;
    }

    if (block.type === "embed") {
      if (!block.data.service || !block.data.source || !block.data.embed) {
        console.warn("Embed block missing required fields:", block);
        return false;
      }
      return true;
    }

    if (block.type === "code") {
      if (
        block.data.code === undefined ||
        typeof block.data.code !== "string"
      ) {
        return false;
      }

      if (isFinalSave && !block.data.code.trim()) {
        console.warn("Code block is empty, dropping on final save:", block);
        return false;
      }

      return true;
    }

    if (block.type === "checklist") {
      if (!block.data.items || !Array.isArray(block.data.items)) {
        console.warn("Checklist block has no items or invalid items:", block);
        return false;
      }
      block.data.items = block.data.items.filter(
        (item) => item.text && typeof item.text === "string" && item.text.trim()
      );
      if (block.data.items.length === 0) {
        console.warn("Checklist block has no valid items:", block);
        return false;
      }
      return true;
    }

    console.warn("Unsupported block type:", block.type);
    return false;
  });

  console.log("Validated blocks:", validBlocks);
  return {
    ...content,
    blocks: validBlocks,
    time: content.time || Date.now(),
    version: content.version || "2.31.0-rc.7",
  };
};

const Editor = ({ data, onChange, onImageUpload, holder }) => {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const lastContentRef = useRef(null);
  const isUpdatingRef = useRef(false);

  const handleEditorChange = useCallback(async () => {
    if (editorInstance.current && !isUpdatingRef.current) {
      try {
        const outputData = await editorInstance.current.save();
        console.log("Saved editor data:", outputData);
        const contentString = JSON.stringify(outputData);
        if (lastContentRef.current !== contentString) {
          lastContentRef.current = contentString;
          if (onChange) {
            onChange(validateEditorContent(outputData));
          }
        }
      } catch (error) {
        console.error("Failed to save editor data:", error);
      }
    }
  }, [onChange]);

  useEffect(() => {
    if (!editorInstance.current) {
      const initialContent = data
        ? validateEditorContent(data)
        : { blocks: [] };
      console.log("Initializing editor with content:", initialContent);

      const editor = new EditorJS({
        holder: holder || "editorjs",
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: "Enter a heading",
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+O",
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile(file) {
                  return new Promise((resolve, reject) => {
                    try {
                      if (onImageUpload) {
                        onImageUpload([file])
                          .then((url) => {
                            resolve({
                              success: 1,
                              file: { url },
                            });
                          })
                          .catch(reject);
                      } else {
                        const url = URL.createObjectURL(file);
                        resolve({
                          success: 1,
                          file: { url },
                        });
                      }
                    } catch (error) {
                      reject(error);
                    }
                  });
                },
              },
            },
          },

          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder: "Start writing...",
              preserveBlank: true,
            },
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/fetchUrl", // Optional: Add endpoint for link metadata fetching
            },
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                vimeo: true,
                twitter: true,
              },
            },
          },
          code: {
            class: CodeTool,
            config: {
              placeholder: "Enter code",
            },
          },
          inlineCode: {
            class: InlineCode,
            shortcut: "CMD+SHIFT+M",
          },

          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          marker: {
            class: Marker,
            shortcut: "CMD+SHIFT+H",
          },
        },
        data: initialContent,
        onChange: handleEditorChange,
        placeholder: "Let's write an awesome story!",
        minHeight: 300,
      });

      editor.isReady
        .then(() => {
          console.log("Editor initialized successfully");
          editorInstance.current = editor;
          lastContentRef.current = JSON.stringify(initialContent);
        })
        .catch((error) => {
          console.error("Editor initialization failed:", error);
        });
    }

    return () => {
      if (
        editorInstance.current &&
        typeof editorInstance.current.destroy === "function"
      ) {
        try {
          editorInstance.current.destroy();
        } catch (error) {
          console.error("Error destroying editor:", error);
        }
        editorInstance.current = null;
      }
    };
  }, [holder]);

  useEffect(() => {
    if (editorInstance.current && data) {
      const contentString = JSON.stringify(data);
      if (lastContentRef.current !== contentString && !isUpdatingRef.current) {
        console.log("Updating editor with new content:", data);
        editorInstance.current.isReady
          .then(() => {
            isUpdatingRef.current = true;
            const validatedContent = validateEditorContent(data);
            console.log("Rendering validated content:", validatedContent);
            return editorInstance.current.render(validatedContent);
          })
          .then(() => {
            lastContentRef.current = contentString;
            isUpdatingRef.current = false;
            console.log("Editor content rendered successfully");
          })
          .catch((error) => {
            console.error("Editor render failed:", error);
            isUpdatingRef.current = false;
          });
      }
    }
  }, [data]);

  return (
    <div>
      <div
        id={holder || "editorjs"}
        ref={editorRef}
        className=" min-h-[300px] prose max-w-none"
        style={{ outline: "none" }}
      />
    </div>
  );
};

export default Editor;
