const userInteracted = (): boolean => {
  const events: Array<keyof DocumentEventMap> = [
    "click",
    "keydown",
    "mousemove",
    "touchstart",
    "scroll",
  ];
  let interacted: boolean = false;

  events.forEach((event) => {
    document.addEventListener(
      event,
      () => {
        if (!interacted) interacted = true;
      },
      { once: true },
    );
  });

  return interacted;
};

export default userInteracted;
