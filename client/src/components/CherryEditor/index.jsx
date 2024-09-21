import { Button, Flex } from 'antd';
import useModal from 'antd/es/modal/useModal';
import Cherry from 'cherry-markdown';
import { useEffect, useRef, useState } from 'react';
import 'cherry-markdown/dist/cherry-markdown.css';
import './CherryEditor.css';
import { useNavigate } from 'react-router-dom';
import routes from '../../routes';

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

function CherryEditor({ value, buttonPropsList }) {
  const cherryInstance = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [html, setHtml] = useState('');
  const [cancelModal, cancelModalContext] = useModal();
  const navigate = useNavigate();

  const handleInputChange = (text, html) => {
    setInputValue(text);
    setHtml(html);
  };

  const handleCancel = () => {
    cancelModal.confirm({
      title: 'Quit Editing',
      content: 'Your current progress will be lost. Are you sure?',
      centered: true,
      okText: 'Keep Editing',
      cancelText: 'Quit',
      cancelButtonProps: {
        type: 'primary',
        danger: true
      },
      onCancel: () => navigate(routes.home)
    });
  };

  useEffect(() => {
    if (!cherryInstance.current) {
      cherryInstance.current = new Cherry({
        value,
        ...cherryConfig
      });
      cherryInstance.current.on('afterChange', handleInputChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div id={cherryConfig.id}>
        <Flex gap={buttonPropsList.length > 1 ? 'small' : 'middle'} wrap className="button-group">
          <Button key="cancel" size="large" danger onClick={handleCancel}>Cancel</Button>
          {buttonPropsList.map((buttonProps, index) => (
            <Button
              key={index}
              size="large"
              type={buttonProps.type}
              onClick={() => buttonProps.onSubmit(inputValue, html)}
              disabled={buttonProps.isDisabled && buttonProps.isDisabled(inputValue)}
            >
              {buttonProps.text}
            </Button>
          ))}
        </Flex>
      </div>
      {cancelModalContext}
    </>
  );
}

export default CherryEditor;
