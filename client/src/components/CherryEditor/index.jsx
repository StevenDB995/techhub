import { createImageMetadata, getImgurAccessToken } from '@/api/services/blogService';
import Loading from '@/components/Loading';
import { parseJSON } from '@/utils/jsonUtil';
import { extractImageLinks, extractMetadata } from '@/utils/mdUtil';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Flex, Form, Input, Modal, Radio, Switch } from 'antd';
import axios from 'axios';
import Cherry from 'cherry-markdown';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'cherry-markdown/dist/cherry-markdown.css';
import styles from './CherryEditor.module.css';

const markdownTemplate = `# Heading 1
## Heading 2
Paragraph here
### Heading 3
If you know, you know ;)`;

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
const supportedImageFormats = ['jpeg', 'jpg', 'png', 'apng', 'gif', 'tiff'];

function CherryEditor({
  page,
  blog,
  loading = false,
  localStorageKey,
  useLocalDraft,  // only applicable when the page is 'edit'
  loadSourceConfirmed = true,  // whether the load source (localStorage or database) of the blog is confirmed
  submitCallback
}) {
  if (!['create', 'edit'].includes(page)) {
    throw new Error(`page prop can be either 'create' or 'edit'`);
  }

  const cherryInstance = useRef(null);
  const localDraft = useRef(parseJSON(localStorage.getItem(localStorageKey)));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [html, setHtml] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);
  const { message: antdMessage } = AntdApp.useApp();

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitForm] = Form.useForm();
  const [saveDraft, setSaveDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (text, html) => {
    setContent(text);
    setHtml(html);
  };

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    const { title: defaultTitle, previewText } = extractMetadata(html);
    const imageLinks = extractImageLinks(html);
    const formData = submitForm.getFieldsValue();

    await submitCallback({
      title: title || defaultTitle,
      previewText,
      content,
      imageLinks,
      status: formData.saveDraft ? 'draft' : formData.visibility
    });

    setSubmitting(false);
  }, [title, content, html, submitForm, submitCallback]);

  const uploadFile = useCallback(async (file, callback) => {
    const [fileType, fileFormat] = file.type.split('/');
    if (fileType !== 'image') {
      antdMessage.error('Only image upload is supported!');
      return;
    }

    if (!supportedImageFormats.includes(fileFormat.toLowerCase())) {
      antdMessage.error(`Your image format (${fileFormat}) is not supported!`);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'file');

    const reloadImgurAccessToken = async () => {
      // return true if successfully reloaded
      try {
        const response = getImgurAccessToken();
        localStorage.setItem('imgurAccessToken', response.data['access_token']);
        return true;
      } catch (err) {
        // cannot fetch access token from imgur
        antdMessage.error(err.message);
        console.error(err);
        return false;
      }
    };

    // fetch imgur access token if it's not in localStorage
    if (!localStorage.getItem('imgurAccessToken')) {
      if (!await reloadImgurAccessToken()) {
        antdMessage.error('Cannot connect to image host, please try again later.');
        return;
      }
    }

    let response;
    let retry = true;
    setUploadingImage(true);

    while (retry) {
      try {
        response = await axios.post('https://api.imgur.com/3/image', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('imgurAccessToken')}`
          }
        });
        retry = false;

        // consider looking into the boolean `response.data.success`?
        const imageMetadata = response.data.data;
        createImageMetadata(imageMetadata)
          .then(() => callback(imageMetadata.link, {
            width: '600px'
          }))
          .catch(err => {
            antdMessage.error(err.message);
            console.error(err);
          });

      } catch (err) {
        if (err.response?.status > 400 && err.response?.status < 500) {
          // retry if the imgur access token expired
          if (!await reloadImgurAccessToken()) {
            antdMessage.error('Cannot connect to image host, please try again later.');
            retry = false;
          }
        } else {
          antdMessage.error('Error uploading image: ' + (err.response?.data.data.error || err.message));
          console.error(err);
          retry = false;
        }
      }
    }

    setUploadingImage(false);
  }, [antdMessage]);

  useEffect(() => {
    if (!cherryInstance.current) {
      cherryInstance.current = new Cherry(cherryConfig);
      cherryInstance.current.on('afterChange', handleContentChange);
      cherryInstance.current.on('fileUpload', uploadFile);
    }
  }, [uploadFile]);

  // fill the content on page load
  useEffect(() => {
    if (page === 'create') {
      cherryInstance.current.setMarkdown(localDraft.current?.content || markdownTemplate);
      setContent(cherryInstance.current.getMarkdown());
      setTitle(localDraft.current?.title || '');
    } else {
      cherryInstance.current.setMarkdown((useLocalDraft ? localDraft.current?.content : blog?.content) || '');
      setContent(cherryInstance.current.getMarkdown());
      setTitle((useLocalDraft ? localDraft.current?.title : blog?.title) || '');
    }
  }, [page, useLocalDraft, blog]);

  // auto-save using localStorage
  useEffect(() => {
    if (!loading && loadSourceConfirmed) {
      localStorage.setItem(localStorageKey, JSON.stringify({ title, content }));
    }
  }, [title, content, loading, loadSourceConfirmed, localStorageKey]);

  // initialise the submit form
  useEffect(() => {
    if (page === 'create') {
      submitForm.setFieldsValue({
        saveDraft: false,
        visibility: 'public'
      });
    } else {
      setSaveDraft(blog?.status === 'draft');
      submitForm.setFieldsValue({
        saveDraft: blog?.status === 'draft',
        visibility: blog?.status === 'draft' ? 'public' : blog?.status
      });
    }
  }, [page, submitForm, blog]);

  return (
    <div className={styles.contentWrapper}>
      <Flex align="center" gap="middle" className={styles.titleContainer}>
        <Button
          variant="link"
          color="primary"
          icon={<DoubleLeftOutlined className={styles.backButtonIcon} />}
          href={`/${blog?.author.username}/blogs?status=${blog?.status}`}
          className={styles.backButton}
        >
          My Blogs
        </Button>
        <Input placeholder="Title" value={title} onChange={handleTitleChange} className={styles.titleInput} />
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={() => setSubmitModalOpen(true)}
          disabled={content.trim() === ''}
        >
          Post
        </Button>
      </Flex>
      <div id={cherryConfig.id} className={styles.cherryEditor}></div>
      <Loading display={loading} />
      <Loading display={uploadingImage} text={'Uploading image'} />
      <Modal
        open={submitModalOpen}
        forceRender
        closable={false}
        maskClosable={false}
        centered={true}
        title={'Post Blog'}
        onCancel={() => setSubmitModalOpen(false)}
        okText={(saveDraft || page === 'edit' && blog?.status !== 'draft') ? 'Save' : 'Post'}
        okButtonProps={{ loading: submitting }}
        onOk={handleSubmit}
      >
        <Form form={submitForm} autoComplete="off">
          {(page === 'create' || blog?.status === 'draft') &&
            <Form.Item name="saveDraft" label="Save draft">
              <Switch onChange={checked => setSaveDraft(checked)} />
            </Form.Item>}
          {!saveDraft &&
            <Form.Item name="visibility" label="Set visibility">
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="public">Public</Radio.Button>
                <Radio.Button value="private">Private</Radio.Button>
              </Radio.Group>
            </Form.Item>}
        </Form>
      </Modal>
    </div>
  );
}

export default CherryEditor;
