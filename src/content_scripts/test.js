(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  function test() {
    console.log("test from content script");
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "test") {
      test();
    }
  });
})();
