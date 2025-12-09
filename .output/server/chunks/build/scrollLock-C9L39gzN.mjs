const _imports_1 = "data:image/svg+xml,%3csvg%20width='100'%20height='100'%20viewBox='0%200%20100%20100'%20xmlns='http://www.w3.org/2000/svg'%3e%3cline%20x1='10'%20y1='10'%20x2='90'%20y2='90'%20stroke='%2363b4c8'%20stroke-width='10'/%3e%3cline%20x1='10'%20y1='90'%20x2='90'%20y2='10'%20stroke='%2363b4c8'%20stroke-width='10'/%3e%3c/svg%3e";
function toggleScrollLock(locked) {
  const html = (void 0).documentElement;
  const body = (void 0).body;
  html.classList.toggle("hidden-scroll", !!locked);
  body.classList.toggle("hidden-scroll", !!locked);
}

export { _imports_1 as _, toggleScrollLock as t };
//# sourceMappingURL=scrollLock-C9L39gzN.mjs.map
