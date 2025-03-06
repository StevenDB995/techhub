import { useCallback } from 'react';

const useConfirm = () => {
  const confirmDanger = useCallback((modal, options) => {
    modal.confirm({
      ...options,
      okButtonProps: {
        danger: true
      },
      autoFocusButton: null
    })
  }, []);

  return { confirmDanger };
}

export default useConfirm;
