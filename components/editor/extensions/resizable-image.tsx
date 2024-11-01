"use client";

import Image from "@tiptap/extension-image";
import { NodeView } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

const ResizableImageComponent = ({ node, updateAttributes }: any) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(node.attrs.width || "auto");
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [alignment, setAlignment] = useState(node.attrs.alignment || "center");

  const onMouseDown = useCallback(
    (e: React.MouseEvent, direction: "left" | "right") => {
      if (imageRef.current) {
        setIsResizing(true);
        setStartX(e.clientX);
        setStartWidth(imageRef.current.offsetWidth);
      }
      e.preventDefault();
    },
    []
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const diff = e.clientX - startX;
      const newWidth = startWidth + diff;
      
      if (imageRef.current && newWidth >= 100) {
        const parentWidth = imageRef.current.parentElement?.parentElement?.offsetWidth || 1;
        const widthPercentage = Math.min(100, Math.max(10, (newWidth / parentWidth) * 100));
        setCurrentWidth(`${widthPercentage}%`);
        updateAttributes({ width: `${widthPercentage}%` });
      }
    },
    [isResizing, startX, startWidth, updateAttributes]
  );

  const onMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const updateAlignment = (newAlignment: string) => {
    setAlignment(newAlignment);
    updateAttributes({ alignment: newAlignment });
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [isResizing, onMouseMove, onMouseUp]);

  return (
    <NodeViewWrapper>
      <div className={`image-container align-${alignment}`}>
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          style={{ width: currentWidth }}
          draggable={false}
        />
        {!isResizing && (
          <>
            <div
              className="resize-handle top-left"
              onMouseDown={(e) => onMouseDown(e, "left")}
            />
            <div
              className="resize-handle top-right"
              onMouseDown={(e) => onMouseDown(e, "right")}
            />
            <div
              className="resize-handle bottom-left"
              onMouseDown={(e) => onMouseDown(e, "left")}
            />
            <div
              className="resize-handle bottom-right"
              onMouseDown={(e) => onMouseDown(e, "right")}
            />
            <div className="image-toolbar">
              <Toggle
                size="sm"
                pressed={alignment === "left"}
                onPressedChange={() => updateAlignment("left")}
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={alignment === "center"}
                onPressedChange={() => updateAlignment("center")}
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={alignment === "right"}
                onPressedChange={() => updateAlignment("right")}
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...Image.config.addAttributes(),
      width: {
        default: "auto",
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      alignment: {
        default: "center",
        renderHTML: (attributes) => ({
          class: `align-${attributes.alignment}`,
        }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});