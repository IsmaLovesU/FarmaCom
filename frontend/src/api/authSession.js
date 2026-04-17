let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null;
    }
  };
};

export const notifyUnauthorized = (error) => {
  if (typeof unauthorizedHandler === 'function') {
    unauthorizedHandler(error);
  }
};
