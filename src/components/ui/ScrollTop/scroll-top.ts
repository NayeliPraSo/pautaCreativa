const button = document.querySelector<HTMLButtonElement>("#scroll-top-btn");

if (button) {
  window.addEventListener("scroll", () => {
    button.classList.toggle("is-visible", window.scrollY > 600);
  });

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}