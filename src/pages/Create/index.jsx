import { Button, Flex } from 'antd';
import Cherry from 'cherry-markdown';
import 'cherry-markdown/dist/cherry-markdown.css';
import { useEffect, useRef } from 'react';
import './Create.css';

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

function Create() {
  const cherryEditor = useRef(null);

  useEffect(() => {
    if (!cherryEditor.current) {
      cherryEditor.current = new Cherry(cherryConfig);
    }
  }, []);

  return <div id={cherryConfig.id}>
    <Flex gap="small" wrap className="button-group">
      <Button type="primary" size="large" danger>Delete</Button>
      <Button type="default" size="large">Save as Draft</Button>
      <Button type="primary" size="large">Post</Button>
    </Flex>
  </div>;
}

export default Create;
