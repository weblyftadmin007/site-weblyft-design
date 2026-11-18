/* Weblyft Design — chat widget loader
   The vendor bundle is 155 KB of third-party JavaScript. Loading it during page
   load costs roughly 200 ms of main-thread blocking on a mid-range phone, so it
   waits until the visitor interacts or six seconds pass. The preconnect in each
   page keeps the origin warm in the meantime. */
(function () {
  var loaded = false;

  function load() {
    if (loaded) return;
    loaded = true;

    var s = document.createElement('script');
    s.src = 'https://chatbot-widget-0of.pages.dev/widget.js';
    s.defer = true;
    s.setAttribute('data-tenant', 'weblyft-design');
    s.setAttribute('data-api-url', 'https://chatbot-api.weblyftt.workers.dev');
    document.body.appendChild(s);
  }

  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (type) {
    window.addEventListener(type, load, { once: true, passive: true });
  });

  setTimeout(load, 6000);
})();
