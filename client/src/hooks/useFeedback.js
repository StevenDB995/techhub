import { useCallback } from 'react';

// Custom hook for feedbacks in different forms, e.g. modal, message
function useFeedback() {
  const feedbackByModal = useCallback((modal, success, successOptions, errorOptions) => {
    if (success) {
      modal.success({
        ...successOptions,
        title: successOptions.title || 'Success',
        cancelButtonProps: { style: { display: 'none' } }
      });
    } else {
      modal.error({
        ...errorOptions,
        title: errorOptions.title || 'Error',
        cancelButtonProps: { style: { display: 'none' } }
      });
    }
  }, []);

  return { feedbackByModal };
}

export default useFeedback;
