import Cherry from 'cherry-markdown';
import { useEffect, useRef } from 'react';
import styles from './CherryViewer.module.css';

const cherryConfig = {
  id: 'cherry-viewer',
  locale: 'en_US',
  editor: {
    defaultModel: 'previewOnly',
    height: 'auto'
  },
  previewer: {
    enablePreviewerBubble: false
  },
  toolbars: {
    toc: {
      position: 'fixed',
      cssText: 'margin-right: 16px;'
    }
  }
};

function CherryViewer({ value }) {
  const cherryInstance = useRef(null);

  useEffect(() => {
    if (!cherryInstance.current) {
      cherryInstance.current = new Cherry({
        value,
        ...cherryConfig
      });
    }
  }, [value]);

  // fill the content on page load
  useEffect(() => {
    cherryInstance.current.setMarkdown(value);
  }, [value]);

  return (
    <div id={cherryConfig.id} className={styles.cherryViewer}></div>
  );
}

export default CherryViewer;
