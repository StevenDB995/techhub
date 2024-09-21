import { Modal, Result } from 'antd';
import { useState } from 'react';

const useFeedbackModal = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);

  const showFeedbackModal = (success, message) => {
    setSuccess(success);
    setMessage(message);
    setOpen(true);
  };

  const handleClose = (successCallback, errorCallback) => {
    setOpen(false);
    if (success) {
      successCallback && successCallback();
    } else {
      errorCallback && errorCallback();
    }
  };

  const FeedbackModal = ({ successCallback, errorCallback }) => (
    <Modal
      open={open}
      centered={true}
      closable={false}
      onOk={() => handleClose(successCallback, errorCallback)}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Result status={success ? 'success' : 'error'} title={message} />
    </Modal>
  );

  return [showFeedbackModal, FeedbackModal];
};

export default useFeedbackModal;
