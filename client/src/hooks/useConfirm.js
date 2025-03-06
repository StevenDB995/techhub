import { useCallback } from 'react';

function useConfirm() {
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
