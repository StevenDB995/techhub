import Cherry from 'cherry-markdown';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import 'cherry-markdown/dist/cherry-markdown.css';
import './CherryEditor.css';

const cherryConfig = {
  id: 'cherry-editor',
  locale: 'en_US',
  editor: {
    height: '100vh'
  },
  toolbars: {
    toolbar: [
      'bold',
      'italic',
      'strikethrough',
      '|',
      'color',
      'header',
      'ruby',
      '|',
      'list',
      'panel',
      'detail',
      {
        insert: [
          'image',
          'audio',
          'video',
          'link',
          'hr',
          'br',
          'code',
          'formula',
          'toc',
          'table'
        ]
      },
      'graph'
    ]
  }
};

CherryEditor.propTypes = {
  buttonGroup: PropTypes.node
};

function CherryEditor({ buttonGroup }) {
  const cherryEditor = useRef(null);

  useEffect(() => {
    if (!cherryEditor.current) {
      cherryEditor.current = new Cherry(cherryConfig);
    }
  }, []);

  return (
    <div id={cherryConfig.id}>
      {buttonGroup}
    </div>
  );
}

export default CherryEditor;
