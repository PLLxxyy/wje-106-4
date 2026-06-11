import { TOAST_AUTO_CLOSE_MS } from '../constants/mealDefaults';

const ERROR_EVENT = 'food-diary-error';

export interface ErrorToastDetail {
  message: string;
}

export const notifyError = (message: string) => {
  window.dispatchEvent(new CustomEvent<ErrorToastDetail>(ERROR_EVENT, { detail: { message } }));
};

export const subscribeError = (callback: (message: string) => void) => {
  const handler = (event: Event) => {
    callback((event as CustomEvent<ErrorToastDetail>).detail.message);
  };
  window.addEventListener(ERROR_EVENT, handler);
  return () => window.removeEventListener(ERROR_EVENT, handler);
};

export const ERROR_TOAST_TIMEOUT = TOAST_AUTO_CLOSE_MS;
