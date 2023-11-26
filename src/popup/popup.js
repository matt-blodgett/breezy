function listenForClicks() {
  document.addEventListener("click", (event) => {
    function test(tabs) {
      console.log("test from popup.js");
    }

    function popupButtonClicked(tabs) {
      const action = event.target.textContent;
      if (action === "Test1") {
        test(tabs);
      } else if (action === "Test2") {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "test",
        });
      }
    }

    function reportError(error) {
      console.error(`Error: ${error}`);
    }

    if (event.target.tagName !== "BUTTON" || !event.target.closest("#popup-content")) {
      return;
    }

    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(popupButtonClicked)
      .catch(reportError);
  });
}

function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}`);
}

browser.tabs
  .executeScript({ file: "/content_scripts/test.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
