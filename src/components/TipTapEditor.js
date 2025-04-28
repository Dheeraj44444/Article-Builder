import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import YouTube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { EditorBlock } from './EditorBlock';

export default function TipTapEditor() {
  const [blocks, setBlocks] = useState([
    { id: 'block-1', type: 'text', content: '<p>This is a text block. You can edit rich text here with formatting options like bold, italic, links, and more.</p>' }
  ]);
  
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  // Handler for adding new blocks
  const handleAddBlock = (e) => {
    const blockType = e.detail;
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      content: getDefaultContentForBlockType(blockType)
    };
    
    setBlocks(prev => [...prev, newBlock]);
    
    // Handle file inputs
    if (blockType === 'image') {
      setTimeout(() => fileInputRef.current.click(), 100);
    } else if (blockType === 'video') {
      setTimeout(() => videoInputRef.current.click(), 100);
    } else if (blockType === 'document') {
      setTimeout(() => documentInputRef.current.click(), 100);
    } else if (blockType === 'youtube') {
      const youtubeUrl = prompt('Enter YouTube URL', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      if (youtubeUrl) {
        updateBlockContent(newBlock.id, `<iframe width="560" height="315" src="${convertYouTubeUrl(youtubeUrl)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
      }
    }
  };

  // Convert YouTube URL to embed URL
  const convertYouTubeUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // Default content for new blocks
  const getDefaultContentForBlockType = (type) => {
    switch(type) {
      case 'text':
        return '<p>Enter your text here...</p>';
      case 'image':
        return '<div class="image-placeholder">Image Preview</div>';
      case 'gallery':
        return '<div class="gallery-placeholder">Gallery Preview</div>';
      case 'video':
        return '<div class="video-placeholder">Video Preview</div>';
      case 'youtube':
        return '<div class="youtube-placeholder">YouTube Video</div>';
      case 'button':
        return '<button class="default-button">Click Me</button>';
      case 'columns':
        return '<div class="columns-container"><div class="column">Column 1</div><div class="column">Column 2</div></div>';
      case 'spacer':
        return '<div class="spacer" style="height: 50px;"></div>';
      case 'html':
        return '<div class="html-code">Custom HTML</div>';
      case 'document':
        return '<div class="document-placeholder">Document Preview</div>';
      default:
        return '<p>New Block</p>';
    }
  };

  // Update block content
  const updateBlockContent = (blockId, content) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
  };

  // Delete a block
  const deleteBlock = (blockId) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  // Move block up
  const moveBlockUp = (blockId) => {
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === blockId);
      if (index <= 0) return prev;
      
      const newBlocks = [...prev];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index - 1];
      newBlocks[index - 1] = temp;
      
      return newBlocks;
    });
  };

  // Move block down
  const moveBlockDown = (blockId) => {
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === blockId);
      if (index >= prev.length - 1) return prev;
      
      const newBlocks = [...prev];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index + 1];
      newBlocks[index + 1] = temp;
      
      return newBlocks;
    });
  };

  // Handle file uploads
  const handleFileUpload = (e, blockId, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    
    if (type === 'image') {
      updateBlockContent(blockId, `<img src="${url}" alt="${file.name}" />`);
    } else if (type === 'video') {
      updateBlockContent(blockId, `<video controls src="${url}" style="width: 100%;"></video>`);
    } else if (type === 'document') {
      updateBlockContent(blockId, `<a href="${url}" download="${file.name}" class="document-link"><i class="fas fa-file-alt"></i> ${file.name}</a>`);
    }
    
    // Reset file input
    e.target.value = '';
  };

  // Save draft and publish functions
  const saveDraft = () => {
    localStorage.setItem('pageBuilderBlocks', JSON.stringify(blocks));
    alert('Page saved successfully!');
  };
  
  const publish = () => {
    // Generate HTML for the page
    const title = document.querySelector('.page-title-input').value || 'Untitled Page';
    
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .page-title { font-size: 2.5rem; margin-bottom: 2rem; }
        .block { margin-bottom: 2rem; }
        img { max-width: 100%; height: auto; }
        .document-link { display: inline-block; padding: 10px 15px; background: #f5f5f5; border-radius: 4px; }
        .default-button { padding: 10px 20px; background: #4a7dff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .columns-container { display: flex; gap: 20px; }
        .column { flex: 1; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="page-title">${title}</h1>
        ${blocks.map(block => `<div class="block">${block.content}</div>`).join('')}
      </div>
    </body>
    </html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`;
    link.click();
  };

  // Event listeners for save and publish
  useEffect(() => {
    // Load saved blocks if they exist
    const savedBlocks = localStorage.getItem('pageBuilderBlocks');
    if (savedBlocks) {
      try {
        setBlocks(JSON.parse(savedBlocks));
      } catch (e) {
        console.error("Couldn't load saved blocks:", e);
      }
    }
    
    const handleSaveDraft = () => saveDraft();
    const handlePublish = () => publish();
    const handleAddBlockEvent = (e) => handleAddBlock(e);
    
    window.addEventListener('save-draft', handleSaveDraft);
    window.addEventListener('publish', handlePublish);
    window.addEventListener('add-block', handleAddBlockEvent);
    
    return () => {
      window.removeEventListener('save-draft', handleSaveDraft);
      window.removeEventListener('publish', handlePublish);
      window.removeEventListener('add-block', handleAddBlockEvent);
    };
  }, [blocks]);

  return (
    <div className="tiptap-editor">
      {/* Render all blocks */}
      {blocks.map((block, index) => (
        <EditorBlock
          key={block.id}
          block={block}
          onDelete={() => deleteBlock(block.id)}
          onMoveUp={() => moveBlockUp(block.id)}
          onMoveDown={() => moveBlockDown(block.id)}
          onChange={(content) => updateBlockContent(block.id, content)}
          isFirst={index === 0}
          isLast={index === blocks.length - 1}
        />
      ))}
      
      {/* File inputs */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef}
        style={{ display: 'none' }} 
        onChange={(e) => {
          // Find the latest image block
          const latestImageBlock = [...blocks].reverse().find(block => block.type === 'image');
          if (latestImageBlock) {
            handleFileUpload(e, latestImageBlock.id, 'image');
          }
        }} 
      />
      
      <input 
        type="file" 
        accept="video/*" 
        ref={videoInputRef}
        style={{ display: 'none' }} 
        onChange={(e) => {
          const latestVideoBlock = [...blocks].reverse().find(block => block.type === 'video');
          if (latestVideoBlock) {
            handleFileUpload(e, latestVideoBlock.id, 'video');
          }
        }} 
      />
      
      <input 
        type="file" 
        ref={documentInputRef}
        style={{ display: 'none' }} 
        onChange={(e) => {
          const latestDocBlock = [...blocks].reverse().find(block => block.type === 'document');
          if (latestDocBlock) {
            handleFileUpload(e, latestDocBlock.id, 'document');
          }
        }} 
      />
    </div>
  );
}