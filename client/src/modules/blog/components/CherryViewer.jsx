import Loading from '@/components/Loading';
import Cherry from 'cherry-markdown';
import { useEffect, useRef } from 'react';
import styles from './CherryViewer.module.css';
import 'cherry-markdown/dist/cherry-markdown.css';
import './cherry-markdown.css';

const cherryConfig = {
  id: 'cherry-viewer',
  locale: 'en_US',
  editor: {
    defaultModel: 'previewOnly',
    height: 'auto'
  },
  previewer: {
    enablePreviewerBubble: false  // disable image resizing
  },
  toolbars: {
    toc: {
      position: 'fixed',
      cssText: 'margin-right: 16px;'
    }
  }
};

function CherryViewer({ value, loading }) {
  const cherryInstance = useRef(null);

  useEffect(() => {
    if (!cherryInstance.current) {
      cherryInstance.current = new Cherry(cherryConfig);
    }
  }, [value]);

  // Fill the content on page load
  // Define this effect after the cherryInstance is created
  useEffect(() => {
    cherryInstance.current.setMarkdown(value || '');
  }, [value]);

  return (
    <>
      <div id={cherryConfig.id} className={styles.cherryViewer}></div>
      <Loading display={loading} />
    </>
  );
}

export default CherryViewer;
