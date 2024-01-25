import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type tostifyFn = (msg: string) => void;

export const toastifyInfo: tostifyFn = (msg) => {
  toast.info(msg, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const toastifySuccess: tostifyFn = (msg) => {
  toast.success(msg, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const toastifyError: tostifyFn = (msg) => {
  toast.error(msg, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const toastifyWarn: tostifyFn = (msg) => {
  toast.warn(msg, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
