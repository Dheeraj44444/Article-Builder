import React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export const ContainerBlock = Node.create({
  name: 'containerBlock',
  group: 'block',
  content: 'block+',
  parseHTML: () => [{ tag: 'div[data-type="container-block"]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'div',
    mergeAttributes(HTMLAttributes, { 'data-type': 'container-block' }),
    0,
  ],
  addNodeView: () => ReactNodeViewRenderer(ContainerComponent),
});

const ContainerComponent = () => (
  <NodeViewWrapper
    className="content-block"
  >
    <div className="block-controls">
      <button className="block-control-btn move-up">
        <i className="fas fa-arrow-up"></i>
      </button>
      <button className="block-control-btn move-down">
        <i className="fas fa-arrow-down"></i>
      </button>
      <button className="block-control-btn delete">
        <i className="fas fa-trash"></i>
      </button>
    </div>
    <div className="block-content">
      <NodeViewContent />
    </div>
  </NodeViewWrapper>
);