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
          copyToChatGPT(highlightedText);
        });
      } else {
        document.getElementById("highlightedText").innerText = "No text highlighted.";
      }
    });
  });
});

function copyToChatGPT(text) {
  // Write the highlighted text to the clipboard
  navigator.clipboard.writeText(text).then(function () {
    alert("Highlighted text copied to Clipboard!");
  });
}

// Listen for the keyboard shortcut and trigger the copy action
chrome.commands.onCommand.addListener(function (command) {
  if (command === "copy_to_chat_gpt") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, function (response) {
        var highlightedText = response ? response.text : "";
        if (highlightedText) {
          copyToChatGPT(highlightedText);
        }
      });
    });
  }
});
