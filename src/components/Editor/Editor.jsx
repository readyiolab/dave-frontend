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

    // Relaxed Validation
    if (block.type === "paragraph") {
      // Allow empty paragraphs or paragraphs with minimal data
      if (!block.data) {
        block.data = { text: "" };
      }
      return true;
    }

    if (block.type === "header") {
      if (!block.data) block.data = { text: "", level: 2 };
      if (!block.data.level) block.data.level = 2;
      return true;
    }

    if (block.type === "list") {
      if (!block.data) block.data = { style: "unordered", items: [] };
      if (!block.data.items) block.data.items = [];
     // Filter out non-string items or empty strings ONLY if strictly necessary, 
     // but for paste often we get partial data. Let's be permissive.
      return true;
    }

    if (block.type === "image") {
       // Keep image if it has a file url OR if it's in loading state (maybe?)
       // But usually validation happens on save.
       if (!block.data || !block.data.file) {
           return false; // Images without file are useless
       }
       return true;
    }
    
    // For other types, accept them to avoid data loss on specific plugins
    return true;
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

  // Debounced save to avoid too many writes and validation loops
  const handleEditorChange = useCallback(async () => {
    if (editorInstance.current && !isUpdatingRef.current) {
      try {
        const outputData = await editorInstance.current.save();
        // console.log("Saved editor data:", outputData); // Reduce noise
        const contentString = JSON.stringify(outputData);
        if (lastContentRef.current !== contentString) {
          lastContentRef.current = contentString;
          if (onChange) {
            // Pass raw output first, let parent handle strict validation if needed, 
            // OR use the relaxed validator here.
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
      // If data is empty or invalid, provide a default structure but don't over-validate on init
      const initialContent = data && data.blocks ? data : { blocks: [] }; 
      
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
                     if (onImageUpload) {
                        onImageUpload([file])
                          .then((url) => {
                            resolve({ success: 1, file: { url } });
                          })
                          .catch(reject);
                      } else {
                        const url = URL.createObjectURL(file);
                        resolve({ success: 1, file: { url } });
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
               // automatic fetch endpoint
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
        placeholder: "Type '/' to choose a block",
        minHeight: 300,
        logLevel: 'ERROR', // Reduce console noise
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
