const debounce = (callback: (...args: any[]) => void, delay: number = 1000) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]): void => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      callback(...args);
    }, delay);
  };
};

export default debounce;
