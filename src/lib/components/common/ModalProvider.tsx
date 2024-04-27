'use client';

import type { ButtonProps } from '@chakra-ui/react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from '@chakra-ui/react';
import type React from 'react';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface ModalData<T> {
  headerContent?: ReactNode;
  footerProps?: {
    confirmButtonProps?: ButtonProps & { content?: ReactNode };
    cancelButtonProps?: ButtonProps & { content?: ReactNode };
  };
  additionalData?: T;
}

interface ModalContextType<T> {
  showModal: (
    content: ReactNode,
    onConfirm: () => void,
    data?: ModalData<T>
  ) => void;
  hideModal: () => void;
}

interface ModalProviderProps {
  children?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModalContext = createContext<ModalContextType<any> | undefined>(
  undefined
);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalHeader, setModalHeader] = useState<ReactNode>(null);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [footerProps, setFooterProps] = useState<
    ModalData<undefined>['footerProps'] | null
  >(null);
  const [onConfirmState, setOnConfirmState] = useState<() => void>(
    () => () => {}
  );

  const hideModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(null);
    setOnConfirmState(() => () => {});
  }, []);

  const showModal = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (
      content: ReactNode,
      confirmAction: () => void,
      data?: ModalData<unknown>
    ) => {
      setModalHeader(data?.headerContent);
      setFooterProps(data?.footerProps);
      setModalContent(content);
      setOnConfirmState(() => () => {
        confirmAction();
        hideModal();
      });
      setIsOpen(true);
    },
    [hideModal]
  );

  const contextValue = useMemo(
    () => ({
      showModal,
      hideModal,
    }),
    [showModal, hideModal]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <Modal isOpen={isOpen} onClose={hideModal}>
        <ModalOverlay />
        <ModalContent>
          {modalHeader}
          {/* <ModalHeader>{t('confirm-to-change-state')}</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>{modalContent}</ModalBody>
          <ModalFooter>
            <Button
              {...footerProps?.cancelButtonProps}
              type="button"
              mr={3}
              onClick={hideModal}
            >
              {footerProps?.cancelButtonProps?.content}
            </Button>
            <Button
              {...footerProps?.confirmButtonProps}
              type="button"
              onClick={onConfirmState}
            >
              {footerProps?.confirmButtonProps?.content}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  );
};

export function useHRModal<T>(): ModalContextType<T> {
  const context = useContext(
    ModalContext as React.Context<ModalContextType<T>>
  );
  if (!context) {
    throw new Error('useHRModal must be used within a ModalProvider');
  }
  return context;
}
