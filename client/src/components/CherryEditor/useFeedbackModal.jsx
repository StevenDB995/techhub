import { Modal, Result } from 'antd';
import { useCallback, useRef, useState } from 'react';

const useFeedbackModal = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const callbackRef = useRef(null); // callback after the OK is clicked

  const showFeedbackModal = useCallback((success, message, callback) => {
    setSuccess(success);
    setMessage(message);
    callbackRef.current = callback;
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    callbackRef.current && callbackRef.current();
  }, []);

  const feedbackModal = (
    <Modal
      open={open}
      centered={true}
      closable={false}
      onOk={handleClose}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Result status={success ? 'success' : 'error'} title={message} />
    </Modal>
  );

  return [showFeedbackModal, feedbackModal];
};

export default useFeedbackModal;
