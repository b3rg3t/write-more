import { FC, useEffect, useRef } from "react";
import { IPortal } from "./Portal";
import { FaTimesCircle } from "react-icons/fa";
import { text } from "../../localization/eng";

interface IPortalMenu extends Omit<IPortal, "slideIn" | "portalWidth"> {
  displayPortal: boolean;
  handleDisplayPortal: () => void;
}

export const PortalMenu: FC<IPortalMenu> = ({
  menuHeader,
  displayPortal,
  handleDisplayPortal,
  children,
}) => {
  const wrapperDivRef = useRef<HTMLDivElement>(null);

  const handleOnMenuClose = () => {
    handleDisplayPortal();
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
    if (displayPortal) {
      wrapperDivRef!.current!.focus();
    }
  }, [displayPortal]);

  return (
    <div
      ref={wrapperDivRef}
      className="w-100 h-100 d-flex flex-column position-relative px-2"
      tabIndex={-1}
    >
      <header className="d-flex bg-green text-white justify-content-between align-items-center gap-4 py-1 border-bottom mb-2">
        <h2 className="display-2 fw-bold">{menuHeader ?? "Menu"}</h2>
        <button
          title={text.button.close}
          className="btn px-2 text-white"
          onClick={handleOnMenuClose}
        >
          <FaTimesCircle />
        </button>
      </header>
      <div className="flex-grow-1 d-flex flex-column justify-content-between overflow-auto">
        {children}
      </div>
    </div>
  );
};
