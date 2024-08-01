/* eslint-disable react/prop-types */
import {
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from "react-icons/ai";
import "./notification.css";

const iconStyles = { marginRight: "10px" };
const icons = {
  success: <AiOutlineCheckCircle style={iconStyles} />,
  info: <AiOutlineInfoCircle style={iconStyles} />,
  warning: <AiOutlineWarning style={iconStyles} />,
  error: <AiOutlineCloseCircle style={iconStyles} />,
};

const Notification = ({
  type = "info",
  message,
  onClose = () => {},
}: {
  type: "success" | "info" | "warning" | "error";
  message: string;
  onClose: () => void;
}) => {
  return (
    <div className={`notification ${type}`}>
      {icons[type]}
      {message}
      <AiOutlineClose
        color="white"
        className="closeBtn"
        onClick={() => onClose()}
      />
    </div>
  );
};

export default Notification;
