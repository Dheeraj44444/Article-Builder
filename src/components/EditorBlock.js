import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import YouTube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Resizable } from 'react-resizable';

export function EditorBlock({ block, onDelete, onMoveUp, onMoveDown, onChange, isFirst, isLast }) {
  const [isResizing, setIsResizing] = useState(false);
  const [blockHeight, setBlockHeight] = useState(
    block.type === 'spacer' ? 50 : null
  );
  
  // Set up editor for text blocks
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      YouTube,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: block.content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when block changes
  useEffect(() => {
    if (editor && block.type === 'text' && editor.getHTML() !== block.content) {
      editor.commands.setContent(block.content);
    }
  }, [block.content, editor]);

  const getBlockLabel = () => {
    const labels = {
      text: 'Text Block',
      image: 'Image Block',
      gallery: 'Gallery Block',
      video: 'Video Block',
      youtube: 'YouTube Block',
      button: 'Button Block',
      columns: 'Columns Block',
      spacer: 'Spacer Block',
      html: 'HTML Block',
      document: 'Document Block'
    };
    return labels[block.type] || 'Block';
  };

  const renderBlockContent = () => {
    if (block.type === 'text') {
      return (
        <div className="text-editor-wrapper">
          <div className="editor-toolbar">
            <button 
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor?.isActive('bold') ? 'is-active' : ''}
            >
              <i className="fas fa-bold"></i>
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor?.isActive('italic') ? 'is-active' : ''}
            >
              <i className="fas fa-italic"></i>
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor?.isActive('underline') ? 'is-active' : ''}
            >
              <i className="fas fa-underline"></i>
            </button>
            <div className="divider"></div>
            <button 
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor?.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
            >
              <i className="fas fa-align-left"></i>
            </button>
            <button 
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor?.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
            >
              <i className="fas fa-align-center"></i>
            </button>
            <button 
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor?.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
            >
              <i className="fas fa-align-right"></i>
            </button>
            <div className="divider"></div>
            <button 
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            >
              <i className="fas fa-heading"></i>
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor?.isActive('bulletList') ? 'is-active' : ''}
            >
              <i className="fas fa-list-ul"></i>
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor?.isActive('orderedList') ? 'is-active' : ''}
            >
              <i className="fas fa-list-ol"></i>
            </button>
            <button 
              onClick={() => {
                const url = prompt('Enter link URL');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={editor?.isActive('link') ? 'is-active' : ''}
            >
              <i className="fas fa-link"></i>
            </button>
          </div>
          <EditorContent editor={editor} />
        </div>
      );
    } else if (block.type === 'spacer') {
      return (
        <Resizable
          height={blockHeight}
          width={Infinity}
          onResize={(e, { size }) => {
            setBlockHeight(size.height);
            onChange(`<div class="spacer" style="height: ${size.height}px;"></div>`);
          }}
          onResizeStart={() => setIsResizing(true)}
          onResizeStop={() => setIsResizing(false)}
          handle={<div className="resize-handle"><i className="fas fa-arrows-alt-v"></i></div>}
        >
          <div className="spacer-content" style={{ height: blockHeight }}>
            <div className="spacer-label">Spacer</div>
          </div>
        </Resizable>
      );
    } else {
      return (
        <div 
          className="non-text-content"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );
    }
  };

  return (
    <div className={`editor-block ${block.type}-block ${isResizing ? 'is-resizing' : ''}`}>
      <div className="block-header">
        <div className="block-type">
          <i className={`fas ${getBlockIcon(block.type)}`}></i>
          <span>{getBlockLabel()}</span>
        </div>
        <div className="block-controls">
          {!isFirst && (
            <button className="block-control" onClick={onMoveUp} title="Move Up">
              <i className="fas fa-arrow-up"></i>
            </button>
          )}
          {!isLast && (
            <button className="block-control" onClick={onMoveDown} title="Move Down">
              <i className="fas fa-arrow-down"></i>
            </button>
          )}
          <button className="block-control" onClick={onDelete} title="Delete Block">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div className="block-content">
        {renderBlockContent()}
      </div>
    </div>
  );
}

function getBlockIcon(type) {
  switch(type) {
    case 'text': return 'fa-paragraph';
    case 'image': return 'fa-image';
    case 'gallery': return 'fa-images';
    case 'video': return 'fa-video';
    case 'youtube': return 'fa-youtube';
    case 'button': return 'fa-mouse-pointer';
    case 'columns': return 'fa-columns';
    case 'spacer': return 'fa-arrows-alt-v';
    case 'html': return 'fa-code';
    case 'document': return 'fa-file-alt';
    default: return 'fa-square';
  }
}