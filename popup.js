document.addEventListener("DOMContentLoaded", function () {
  // Send a message to the content script to get the selected text
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, function (response) {
      var highlightedText = response ? response.text : "";
      if (highlightedText) {
        document.getElementById("highlightedText").innerText = highlightedText;

        // Add event listener to the copy button
        var copyButton = document.getElementById("copyButton");
        copyButton.addEventListener("click", function () {
          CopyToClipboard(highlightedText);
        });
      } else {
        document.getElementById("highlightedText").innerText = "No text highlighted.";
      }
    });
  });
});

function CopyToClipboard(text) {
  // Write the highlighted text to the clipboard
  navigator.clipboard.writeText(text).then(function () {
    // No alert here, the message won't be displayed as an alert
    // You can add any other custom logic or UI feedback here if needed
  });
}

// Listen for the custom keyboard shortcut and trigger the copy action
chrome.commands.onCommand.addListener(function (command) {
  if (command === "custom_copy_command") { // Updated to match the custom command name
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, function (response) {
        var highlightedText = response ? response.text : "";
        if (highlightedText) {
          CopyToClipboard(highlightedText);
        }
      });
    });
  }
});
