import { ReactNode, FC } from "react";
import { createPortal } from "react-dom";
import { FaBurger } from "react-icons/fa6";
import "./portal.style.scss";
import { PortalMenu } from "./PortalMenu";
import { text } from "../../localization/eng";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  selectMenuOpen,
  setIsMenuOpen,
} from "../../store/reducers/game/gameSlice";

export interface IPortal {
  slideIn?: "left" | "right";
  portalWidth?: number;
  menuHeader: string;
  children: ReactNode;
}

export const Portal: FC<IPortal> = (props) => {
  const {
    slideIn = "right",
    portalWidth = 300,
    children,
    ...otherPorps
  } = props;
  const dispatch = useAppDispatch();
  const isMenuOpen = useAppSelector(selectMenuOpen);

  const handleOpenMenu = () => {
    if (!isMenuOpen) {
      dispatch(setIsMenuOpen(true));
    }
  };

  const handleCloseMenu = () => {
    dispatch(setIsMenuOpen(false));
  };

  return (
    <>
      <button
        title={text.button.openMenu}
        type="button"
        aria-label="open menu"
        className={`btn text-white py-0 px-2`}
        onClick={() => handleOpenMenu()}
      >
        <FaBurger />
      </button>
      {createPortal(
        <div
          className={`portal__menu bg-dark shadow ${
            isMenuOpen ? "portal-active" : ""
          } portal__menu-${slideIn ?? "right"}`}
          style={{ width: portalWidth }}
          aria-hidden={!isMenuOpen}
          aria-live="assertive"
        >
          {isMenuOpen && (
            <PortalMenu
              displayPortal={isMenuOpen}
              handleDisplayPortal={handleCloseMenu}
              {...otherPorps}
            >
              {isMenuOpen ? children : null}
            </PortalMenu>
          )}
        </div>,
        document.body
      )}
    </>
  );
};
