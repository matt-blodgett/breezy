function logError(error) {
  console.error(`Error: ${error}`);
}

function listenForClicks() {
  document.addEventListener("click", (event) => {
    function test() {
      console.log("test from popup.js");
      document.getElementById('warning-label').textContent = 'Warning';
    }

    function popupButtonClicked(tabs) {
      const action = event.target.textContent;
      if (action === "Test1") {
        test();
      } else if (action === "Test2") {
        browser.tabs
          .sendMessage(tabs[0].id, {
            command: "test",
          })
          .then((response) => {
            console.log(response);
          });
      }
    }

    if (
      event.target.tagName !== "BUTTON" ||
      !event.target.closest("#popup-content")
    ) {
      return;
    }

    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(popupButtonClicked)
      .catch(reportError);
  });
}

function handleErrorExecuteScript(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}`);
}

function injectScripts(tabs) {
  browser.scripting
    .executeScript({
      target: {
        tabId: tabs[0].id,
      },
      files: ["/scripts/third_party/browser-polyfill.js", "/scripts/test.js"],
    })
    .then(listenForClicks)
    .catch(handleErrorExecuteScript);
}

browser.tabs
  .query({ currentWindow: true, active: true })
  .then(injectScripts)
  .catch(logError);
