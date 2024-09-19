import { Flex } from 'antd';
import Cherry from 'cherry-markdown';
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
    ],
    toc: true
  }
};

function CherryEditor({ value, onChange, buttons }) {
  const cherryInstance = useRef(null);

  useEffect(() => {
    if (!cherryInstance.current) {
      cherryInstance.current = new Cherry({
        value,
        ...cherryConfig
      });
      cherryInstance.current.on('afterChange', onChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id={cherryConfig.id}>
      <Flex gap={buttons.length > 2 ? 'small' : 'middle'} wrap className="button-group">
        {buttons.map(button => button)}
      </Flex>
    </div>
  );
}

export default CherryEditor;
