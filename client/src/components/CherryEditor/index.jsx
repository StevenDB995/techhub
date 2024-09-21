import { Button, Flex } from 'antd';
import useModal from 'antd/es/modal/useModal';
import Cherry from 'cherry-markdown';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../routes';
import Loading from './Loading';
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

function CherryEditor({ value, buttonPropsList }) {
  const cherryInstance = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [html, setHtml] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cancelModal, cancelModalContext] = useModal();
  const navigate = useNavigate();

  const handleInputChange = (text, html) => {
    setInputValue(text);
    setHtml(html);
  };

  const handleSubmit = async (onSubmit) => {
    setSubmitting(true);
    await onSubmit(inputValue, html);
    setSubmitting(false);
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
              onClick={() => handleSubmit(buttonProps.onSubmit)}
              disabled={buttonProps.isDisabled && buttonProps.isDisabled(inputValue)}
            >
              {buttonProps.text}
            </Button>
          ))}
        </Flex>
      </div>
      <Loading display={submitting} />
      {cancelModalContext}
    </>
  );
}

export default CherryEditor;
