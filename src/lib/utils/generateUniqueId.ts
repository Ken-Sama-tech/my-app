const generateUniqueId = (): string => {
  const randomNum = Math.random();
  const id = randomNum.toString(36).slice(2);
  return id;
};

export default generateUniqueId;
