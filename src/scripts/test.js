(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  function test() {
    console.log("test from content script");
  }

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "test") {
      test();
      sendResponse({ response: "responded test" });
    }
  });
})();
