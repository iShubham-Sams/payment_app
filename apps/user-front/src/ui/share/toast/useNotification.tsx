import { useCallback, useState } from "react";
import Notification from "./index";

type Notification = {
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration: number;
  animation: string;
};
const useNotification = (position = "top-right") => {
  const [notification, setNotification] = useState<Pick<
    Notification,
    "type" | "message"
  > | null>(null);

  let timer: null | any;

  const triggerNotification = useCallback((notificationProps: Notification) => {
    clearTimeout(timer);
    setNotification({
      type: notificationProps.type,
      message: notificationProps.message,
    });
    timer = setTimeout(() => {
      setNotification(null);
    }, notificationProps.duration);
  }, []);

  const NotificationComponent = notification ? (
    <div className={`${position}`}>
      <Notification {...notification} onClose={() => setNotification(null)} />
    </div>
  ) : null;

  return { NotificationComponent, triggerNotification };
};

export default useNotification;
