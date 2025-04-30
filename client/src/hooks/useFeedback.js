import { useCallback } from 'react';

// Custom hook for feedbacks in different forms, e.g. modal, message
const useFeedback = () => {

  const feedbackByModal = useCallback((modal, success, content = undefined) => {
    if (success) {
      modal.success({
        title: 'Success',
        content: content || 'Operation success',
        cancelButtonProps: { style: { display: 'none' } }
      });
    } else {
      modal.error({
        title: 'Error',
        content: content || 'An unexpected error occurred. Please try again later.',
        cancelButtonProps: { style: { display: 'none' } }
      });
    }
  }, []);

  return { feedbackByModal };
};

export default useFeedback;
