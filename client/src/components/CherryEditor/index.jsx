import { App as AntdApp, Button, Flex, Input } from 'antd';
import request from 'axios';
import Cherry from 'cherry-markdown';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import useFetch from '../../hooks/useFetch';
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

// Supported image type: https://apidocs.imgur.com/#c85c9dfc-7487-4de2-9ecd-66f727cf3139
const supportedImageFormat = ['jpeg', 'jpg', 'png', 'apng', 'gif', 'tiff'];

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

  const { data: imgur } = useFetch('/blogs/images/imgur-client-id');
  const [uploadingImage, setUploadingImage] = useState(false);
  const axios = useAxios();
  const { modal: antdModal, message: antdMessage } = AntdApp.useApp();
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

  const uploadFile = useCallback(async (file, callback) => {
    const [fileType, fileFormat] = file.type.split('/');
    if (fileType !== 'image') {
      antdMessage.error('Only image upload is supported!');
      return;
    }

    if (!supportedImageFormat.includes(fileFormat.toLowerCase())) {
      antdMessage.error(`Your image format (${fileFormat}) is not supported!`);
      return;
    }

    if (!imgur?.clientId) {
      antdMessage.error('Network error while uploading image, please try again later.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'file');

    try {
      setUploadingImage(true);
      const response = await request.post('https://api.imgur.com/3/image', formData, {
        headers: {
          'Authorization': `Client-ID ${imgur.clientId}`
        }
      });

      const imageMetadata = response.data.data;
      axios.post('/blogs/images', imageMetadata)
        .catch(err => console.error(err));
      callback(imageMetadata.link, {
        width: '80%'
      });

    } catch (err) {
      antdMessage.error('Error uploading image: ' + err.response.data.data.error);
      console.error(err);

    } finally {
      setUploadingImage(false);
    }
  }, [imgur]);

  useEffect(() => {
    if (!cherryInstance.current) {
      cherryInstance.current = new Cherry(cherryConfig);
      cherryInstance.current.on('afterChange', handleContentChange);
    } else {
      // update the fileUpload callback when the imgur state changes
      cherryInstance.current.on('fileUpload', uploadFile);
    }
  }, [uploadFile]);

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
      <Loading display={uploadingImage} text={'Uploading image'} />
    </div>
  );
}

export default CherryEditor;
