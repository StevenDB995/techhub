import { uploadImage } from '@/api/external/imgur';
import { createImageMetadata } from '@/api/services/blogService';
import Loading from '@/components/Loading';
import useApiErrorHandler from '@/hooks/useApiErrorHandler';
import { validateFileType } from '@/utils/fileUploadUtil';
import { parseJSON } from '@/utils/jsonUtil';
import { extractMetadata } from '@/utils/mdUtil';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, ConfigProvider, Flex, Form, Input, Modal, Radio, Switch } from 'antd';
import Cherry from 'cherry-markdown';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'cherry-markdown/dist/cherry-markdown.css';
import styles from './CherryEditor.module.css';

const markdownTemplate = `# Heading 1
## Heading 2
Paragraph here
### Heading 3
If you know, you know ;)`;

const allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
const allowedFileExtensions = ['.jpg', '.jpeg', '.png'];

const MAX_TITLE_LENGTH = 70;
const MAX_ABSTRACT_LENGTH = 280;
const MAX_IMAGE_WIDTH = 600;

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
  },
  fileTypeLimitMap: {
    image: allowedFileExtensions.join(',')
  }
};

function CherryEditor({
  page,
  blog,
  username,
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
  const handleApiError = useApiErrorHandler();

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitForm] = Form.useForm();
  const saveDraft = Form.useWatch('saveDraft', submitForm);
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
    const { title: defaultTitle, previewText, imageLinks } = extractMetadata(html);
    const formData = submitForm.getFieldsValue();

    await submitCallback({
      title: title || defaultTitle,
      abstract: formData.abstract,
      previewText,
      content,
      imageLinks,
      status: formData.saveDraft ? 'draft' : formData.visibility
    });

    setSubmitting(false);
  }, [title, content, html, submitForm, submitCallback]);

  const uploadFile = useCallback(async (file, callback) => {
    if (!validateFileType(file, allowedFileTypes)) {
      antdMessage.error(`Unsupported file type. 
      Please upload an image of valid format (${allowedFileExtensions.join(', ')}).`, 5);
      return;
    }

    setUploadingImage(true);

    try {
      const response = await uploadImage(file);
      const { data: imageMetadata } = response.data;

      createImageMetadata(imageMetadata)
        .then(() => {
          const { link, width, height } = imageMetadata;
          let displayWidth;

          if (width <= MAX_IMAGE_WIDTH) {
            displayWidth = width;
          } else if (height / width < 4 / 3) {
            displayWidth = MAX_IMAGE_WIDTH;
          } else {
            displayWidth = MAX_IMAGE_WIDTH / 2;
          }

          callback(link, { width: `${displayWidth}px` });

        })
        .catch(err => {
          handleApiError(err);
        });

    } catch (err) {
      if (err.source === 'imgur') {
        antdMessage.error('Cannot connect to image host, please try again later.');
        console.error(err);
      } else {
        handleApiError(err);
      }
    }

    setUploadingImage(false);
  }, [antdMessage, handleApiError]);

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
    submitForm.setFieldsValue({
      'abstract': blog?.abstract
    });

    if (page === 'create') {
      submitForm.setFieldsValue({
        saveDraft: false,
        visibility: 'public'
      });
    } else {
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
          href={page === 'create' ?
            (username && `/${username}/blogs`) :
            (blog && `/${blog.author.username}/blogs?status=${blog.status}`)}
          className={styles.backButton}
        >
          My Blogs
        </Button>
        <Input
          placeholder="Title"
          maxLength={MAX_TITLE_LENGTH}
          showCount={true}
          className={styles.titleInput}
          value={title}
          onChange={handleTitleChange}
        />
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
        centered
        closable={false}
        maskClosable={false}
        title={'Post Blog'}
        onCancel={() => setSubmitModalOpen(false)}
        okText={(saveDraft || page === 'edit' && blog?.status !== 'draft') ? 'Save' : 'Post'}
        okButtonProps={{ loading: submitting }}
        onOk={handleSubmit}
        width={768}
        styles={{
          header: {
            marginBottom: 24
          },
          body: {
            minHeight: 256
          }
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Form: {
                labelColonMarginInlineEnd: 16
              }
            }
          }}
        >
          <Form
            form={submitForm}
            autoComplete="off"
            labelCol={{ span: 4 }}
          >
            <Form.Item name="abstract" label="Abstract">
              <Input.TextArea
                maxLength={MAX_ABSTRACT_LENGTH}
                showCount={true}
                rows={4}
                placeholder={'Wanna engage more readers? Write something here!'}
              />
            </Form.Item>
            {(page === 'create' || blog?.status === 'draft') &&
              <Form.Item name="saveDraft" label="Save draft">
                <Switch />
              </Form.Item>}
            {!saveDraft &&
              <Form.Item name="visibility" label="Set visibility">
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="public">Public</Radio.Button>
                  <Radio.Button value="private">Private</Radio.Button>
                </Radio.Group>
              </Form.Item>}
          </Form>
        </ConfigProvider>
      </Modal>
    </div>
  );
}

export default CherryEditor;
