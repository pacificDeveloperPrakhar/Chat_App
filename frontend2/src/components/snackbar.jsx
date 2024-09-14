import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { MdQuestionMark, MdDone, MdErrorOutline } from "react-icons/md";
import { closeToast } from "../slices/toastSlice";
import { BsSendCheck } from "react-icons/bs";
function Snackbar_item({ mssg, type, theme, Key }) {
  let icon;
  const dispatch = useDispatch();

  switch (type) {
    case "info":
      icon = <FaExclamation />;
      break;
    case "quest":
      icon = <MdQuestionMark />;
      break;
    case "success":
      icon = <MdDone />;
      break;
    case "error":
      icon = <MdErrorOutline />;
      break;
    case 'send':
      icon=<BsSendCheck />
    default:
      icon = null;
  }

  useEffect(() => {
    let timer = setTimeout(() => {
      dispatch(closeToast({ key: Key }));
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, Key]);

  return (
    <motion.div
      className="snackbar"
      style={{ backgroundColor: 'rgba(22, 96, 224, 0.5)' }}
      initial={{  x: -500 }}
      animate={{  x: 0 }}
      exit={{  x: -500 }}
      transition={{ duration: 0.3 }}
    >
      <div className="icon_contain px-2 py-2" style={{ backgroundColor:theme ,alignSelf:"stretch" }}>
        <span className="snackbar_icon">{icon}</span>
      </div>
      <span className="snackbar_label">{mssg}</span>
      <span className="snackbar_dismiss" onClick={() => dispatch(closeToast({ key: Key }))}>
        <IoMdClose />
      </span>
    </motion.div>
  );
}

export default function Snackbar() {
  const toasts = useSelector((state) => state.toast.toasts);

  return (
    <motion.div className="snackbar_container" layout transition={{
      duration:0.4
    }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Snackbar_item
            key={toast.key}
            Key={toast.key}
            type={toast.type}
            mssg={toast.mssg}
            theme={toast.theme}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
