// Write your JavaScript code.

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/serviceworker.js')
      .then(function () {
        console.log('Service worker registered!');
      })
      .catch(function(err) {
        console.log(err);
      });
  }
