import Cherry from 'cherry-markdown';
import { useEffect, useRef } from 'react';

const cherryConfig = {
  id: 'cherry-viewer',
  locale: 'en_US',
  editor: {
    defaultModel: 'previewOnly'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fill the content on page load
  useEffect(() => {
    cherryInstance.current.setMarkdown(value);
  }, [value]);

  return (
    <div id={cherryConfig.id}></div>
  );
}

export default CherryViewer;
