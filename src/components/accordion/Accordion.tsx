import { FC } from "react";
import { IAccordion } from "../../models/interface/IAccordion";
import { FaChevronDown } from "react-icons/fa";

export const Accordion: FC<IAccordion> = ({
  id,
  title,
  children,
  className,
  classNameContainer,
  headerContent,
  defaultOpen = false,
  icon,
}) => {
  return (
    <details id={id} open={defaultOpen} className={classNameContainer}>
      <summary className="text-white border-bottom d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-1">
          {icon && icon}
          {title}
          {headerContent}
        </div>
        <div className="p-1">
          <div className="d-flex justify-content-center align-items-center">
            <FaChevronDown className="rotate" />
          </div>
        </div>
      </summary>
      <div className={`${className} pt-2`}>{children}</div>
    </details>
  );
};
