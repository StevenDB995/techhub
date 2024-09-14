import { Flex } from 'antd';
import Cherry from 'cherry-markdown';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useRef } from 'react';
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
  value: PropTypes.string,
  onChange: PropTypes.func,
  buttons: PropTypes.arrayOf(PropTypes.node),
  buttonGap: PropTypes.string,
}

function CherryEditor({ value, onChange, buttons, buttonGap }) {
  const cherryInstance = useRef(null);

  useEffect(() => {
    if (!cherryInstance.current) {
      cherryInstance.current = new Cherry({
        value,
        ...cherryConfig
      });
      cherryInstance.current.on('afterChange', onChange);
    }
  }, []);

  return (
    <div id={cherryConfig.id}>
      <Flex gap={buttonGap} wrap className="button-group">
        {buttons.map((button, key) => (
          <Fragment key={key}>{button}</Fragment>
        ))}
      </Flex>
    </div>
  );
}

export default CherryEditor;
