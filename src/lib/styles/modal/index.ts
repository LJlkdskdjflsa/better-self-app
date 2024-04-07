import type { ModalProps } from '@chakra-ui/modal';

export const baseModalStyles = {
  modal: {
    size: '6xl',
    scrollBehavior: 'inside' as ModalProps['scrollBehavior'],
  },
  modalContent: { w: '100%', h: '80%' },
};
