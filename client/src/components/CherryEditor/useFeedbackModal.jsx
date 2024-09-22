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

  const handleClose = (onSuccess, onError) => {
    setOpen(false);
    if (success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
  };

  const FeedbackModal = ({ onSuccess, onError }) => (
    <Modal
      open={open}
      centered={true}
      closable={false}
      onOk={() => handleClose(onSuccess, onError)}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Result status={success ? 'success' : 'error'} title={message} />
    </Modal>
  );

  return [showFeedbackModal, FeedbackModal];
};

export default useFeedbackModal;
