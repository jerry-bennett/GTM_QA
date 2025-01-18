document.addEventListener("DOMContentLoaded", () => {
    window.dataLayer = window.dataLayer || [];
    const originalPush = dataLayer.push;
  
    dataLayer.push = function (...args) {
      console.log("GTM event fired:", args);
      originalPush.apply(this, args);
    };
  });
  