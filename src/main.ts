import App from "./App.svelte";
import "svelte-material-ui/bare.css";
import "./global.css";

const app = new App({ target: document.body });

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

export default app;
