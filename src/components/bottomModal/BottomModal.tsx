import {
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  useImperativeHandle,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "./bottomModal.style.scss";
import { BottomModalMenu } from "./BottomModalMenu";

export interface IBottomModal {
  modalHeight: number | string;
  children?: ReactNode;
  header?: string;
}
export interface IBottomModalRef {
  openBottomModal: () => void;
  closeBottomModal: () => void;
}

export const BottomModal: ForwardRefExoticComponent<
  IBottomModal & React.RefAttributes<IBottomModalRef>
> = forwardRef<IBottomModalRef, IBottomModal>((props, ref) => {
  const { modalHeight = 500, children } = props;

  const [displayModal, setDisplayModal] = useState<boolean>(false);

  useImperativeHandle(
    ref,
    () => ({
      openBottomModal: () => setDisplayModal(true),
      closeBottomModal: () => setDisplayModal(false)
    }),
    []
  );

  return (
    <>
      {createPortal(
        <div
          className={`bottomModal__menu shadow ${
            displayModal ? "bottomModal-active" : "bottomModal__menu-bottom"
          }`}
          style={{
            height: modalHeight,
          }}
          aria-hidden={!displayModal}
          aria-live="assertive"
        >
          <BottomModalMenu
            {...props}
            displayModal={displayModal}
            setDisplayModal={setDisplayModal}
          >
            {children}
          </BottomModalMenu>
        </div>,
        document.body
      )}
    </>
  );
});
