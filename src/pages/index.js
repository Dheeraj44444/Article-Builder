import Head from 'next/head';
import TipTapEditor from '../components/TipTapEditor';

export default function Home() {
  return (
    <>
      <Head>
        <title>WordPress-like Page Builder</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      </Head>
      {/* Sleek header with specified color */}
      <header className="builder-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-layer-group"></i>
              <span>WordPress-like Page Builder</span>
            </div>
            <div className="actions">
              <button className="btn save-btn" onClick={() => window.dispatchEvent(new Event('save-draft'))}>
                Save
              </button>
              <button className="btn publish-btn" onClick={() => window.dispatchEvent(new Event('publish'))}>
                Publish
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="page-builder-content">
        <div className="container">
          <div className="page-builder-layout">
            {/* Sidebar with block options */}
            <div className="sidebar">
              <div className="sidebar-header">Add Blocks</div>
              <div className="block-options">
                {[
                  { name: 'Text', icon: 'fa-paragraph' },
                  { name: 'Image', icon: 'fa-image' },
                  { name: 'Gallery', icon: 'fa-images' },
                  { name: 'Video', icon: 'fa-video' },
                  { name: 'YouTube', icon: 'fa-youtube' },
                  { name: 'Button', icon: 'fa-mouse-pointer' },
                  { name: 'Columns', icon: 'fa-columns' },
                  { name: 'Spacer', icon: 'fa-arrows-alt-v' },
                  { name: 'HTML', icon: 'fa-code' },
                  { name: 'Document', icon: 'fa-file-alt' }
                ].map(block => (
                  <div 
                    key={block.name} 
                    className="block-option" 
                    onClick={() => window.dispatchEvent(new CustomEvent('add-block', { detail: block.name.toLowerCase() }))}
                  >
                    <i className={`fas ${block.icon}`}></i>
                    <span>{block.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Editor area */}
            <div className="editor-area">
              <div className="page-title-container">
                <input 
                  type="text" 
                  className="page-title-input" 
                  placeholder="Enter page title..." 
                />
              </div>
              <TipTapEditor />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};