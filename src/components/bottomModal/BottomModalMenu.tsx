import React, { FC, ReactNode, useEffect, useRef } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { IBottomModal } from "./BottomModal";
import { text } from "../../localization/eng";

interface IBottomModalMenu
  extends Omit<IBottomModal, "modalHeight" | "children"> {
  displayModal: boolean;
  setDisplayModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}

export const BottomModalMenu: FC<IBottomModalMenu> = ({
  displayModal,
  setDisplayModal,
  children,
  header,
}) => {
  const wrapperDivRef = useRef<HTMLDivElement>(null);

  const handleOnMenuClose = () => {
    setDisplayModal(false);
  };

  const handleClickOutside = (event: any) => {
    if (
      wrapperDivRef.current &&
      !wrapperDivRef.current.contains(event.target)
    ) {
      handleOnMenuClose();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (displayModal) {
      wrapperDivRef!.current!.focus();
    }
  }, [displayModal]);

  return (
    <div
      ref={wrapperDivRef}
      className="d-flex flex-column w-100 pb-4 position-relative"
    >
      <div className="d-flex justify-content-center py-2 position-relative">
        <div className="bottomModal__dragHandle" />
        <button
          type="button"
          title={text.button.close}
          className="bottomModal__close-btn btn px-2 text-white position-absolute"
          onClick={handleOnMenuClose}
        >
          <FaTimesCircle />
        </button>
      </div>
      <header className="d-flex justify-content-between w-100 mb-2 px-2">
        <h3 className="text-white display-3 fw-bold">{header}</h3>
      </header>
      <div className="px-2 flex-grow-1 overflow-auto">{children}</div>
    </div>
  );
};
