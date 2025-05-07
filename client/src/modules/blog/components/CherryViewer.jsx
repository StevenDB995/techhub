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
    if (!loading && !cherryInstance.current) {
      cherryConfig.value = value;
      cherryInstance.current = new Cherry(cherryConfig);
    }
  }, [loading, value]);

  return (
    <>
      <div id={cherryConfig.id} className={styles.cherryViewer} />
      <Loading display={loading} />
    </>
  );
}

export default CherryViewer;
