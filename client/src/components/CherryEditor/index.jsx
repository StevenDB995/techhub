import { App as AntdApp, Button, Flex, Input } from 'antd';
import Cherry from 'cherry-markdown';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractMetaData } from '../../utils/mdUtil';
import Loading from '../Loading';
import 'cherry-markdown/dist/cherry-markdown.css';
import styles from './CherryEditor.module.css';

const cherryConfig = {
  id: 'cherry-editor',
  locale: 'en_US',
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

function CherryEditor({
  initialTitle = '',
  initialContent,
  loading = false,
  buttonPropsList,
  localStorageKey,
  loadSourceConfirmed = true  // whether the load source (localStorage or database) of the blog is confirmed
}) {
  const cherryInstance = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [html, setHtml] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { modal: antdModal } = AntdApp.useApp();
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (text, html) => {
    setContent(text);
    setHtml(html);
  };

  const handleSubmit = async (onSubmit) => {
    setSubmitting(true);
    const { title: defaultTitle, previewText } = extractMetaData(html);
    await onSubmit({
      title: title || defaultTitle,
      previewText,
      content
    });
    setSubmitting(false);
  };

  const handleCancel = () => {
    antdModal.confirm({
      title: 'Quit Editing',
      content: 'Are you sure? Don\'t worry, your current progress will be saved locally after quiting.',
      centered: true,
      okText: 'Keep Editing',
      cancelText: 'Quit',
      onCancel: () => navigate('/my-blogs')
    });
  };

  useEffect(() => {
    if (!cherryInstance.current) {
      cherryInstance.current = new Cherry(cherryConfig);
      cherryInstance.current.on('afterChange', handleContentChange);
    }
  }, []);

  // fill the content on page load
  useEffect(() => {
    cherryInstance.current.setMarkdown(initialContent);
    setContent(initialContent);
    setTitle(initialTitle);
  }, [initialTitle, initialContent]);

  // auto-save using localStorage
  useEffect(() => {
    if (!loading && loadSourceConfirmed) {
      localStorage.setItem(localStorageKey, JSON.stringify({ title, content }));
    }
  }, [title, content, loading, loadSourceConfirmed, localStorageKey]);

  return (
    <div className={styles.contentWrapper}>
      <Flex align="center" className={styles.titleContainer}>
        <Input placeholder="Title" value={title} onChange={handleTitleChange} className={styles.titleInput} />
      </Flex>
      <div id={cherryConfig.id} className={styles.cherryEditor}>
        <Flex gap={buttonPropsList.length > 1 ? 'small' : 'middle'} wrap className={styles.buttonGroup}>
          <Button key="cancel" size="large" danger onClick={handleCancel}>Cancel</Button>
          {buttonPropsList.map(({ type, text, onSubmit, isDisabled }, index) => (
            <Button
              key={index}
              size="large"
              type={type}
              onClick={() => handleSubmit(onSubmit)}
              disabled={isDisabled && isDisabled(title, content)}
            >
              {text}
            </Button>
          ))}
        </Flex>
      </div>
      <Loading display={loading || submitting} />
    </div>
  );
}

export default CherryEditor;
