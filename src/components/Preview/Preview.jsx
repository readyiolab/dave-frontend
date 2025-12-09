import React from "react";
import PropTypes from "prop-types";

const Preview = ({ data }) => {
  if (!data || !data.blocks || !Array.isArray(data.blocks)) {
    return <div>No content to preview</div>;
  }

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "header":
        const HeaderTag = `h${block.data.level || 2}`;
        return <HeaderTag key={index} className="text-black">{block.data.text}</HeaderTag>;
      case "paragraph":
        return (
          <p key={index} className="text-black" dangerouslySetInnerHTML={{ __html: block.data.text }} />
        );
      case "list":
        const ListTag = block.data.style === "ordered" ? "ol" : "ul";
        return (
          <ListTag key={index} className="text-black list-disc list-inside">
            {block.data.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ListTag>
        );
      case "image":
        return (
          <img
            key={index}
            src={block.data.file?.url || block.data.url}
            alt={block.data.caption || "Blog image"}
            className="w-full max-w-2xl my-4"
          />
        );
      case "quote":
        return (
          <blockquote key={index} className="border-l-4 border-black pl-4 italic text-black">
            {block.data.text}
            {block.data.caption && <cite className="block mt-2 text-gray-600">— {block.data.caption}</cite>}
          </blockquote>
        );
      case "code":
        return (
          <pre key={index} className="bg-gray-100 p-4 rounded text-black">
            <code>{block.data.code}</code>
          </pre>
        );
      case "embed":
        return (
          <div key={index} className="my-4">
            <iframe
              src={block.data.embed}
              title={block.data.caption || "Embedded content"}
              className="w-full h-64"
            />
            {block.data.caption && <p className="text-gray-600">{block.data.caption}</p>}
          </div>
        );
      default:
        return null; // Ignore unsupported block types
    }
  };

  return (
    <div className="prose max-w-none p-4">
      {data.blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

Preview.propTypes = {
  data: PropTypes.shape({
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
      })
    ),
  }),
};

export default Preview;