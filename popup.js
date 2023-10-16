document.addEventListener("DOMContentLoaded", function () {
  // Send a message to the content script to get the selected text
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, function (response) {
      var highlightedText = response ? response.text : "";
      if (highlightedText) {
        document.getElementById("highlightedText").innerText = highlightedText;

        // Add event listener to the copy button
        var copyButton = document.getElementById("copyButton");
        var copySuccess = document.querySelector(".copy-success");
        copyButton.addEventListener("click", function () {
          CopyToClipboard(highlightedText);
          // Show the success message
           copySuccess.style.display = "block";

          // Trigger the animation
          copyButton.disabled = true; // Disable the button during the animation
          setTimeout(function () {
          // Hide the success message and enable the button after a delay
          copySuccess.style.display = "none";
          copyButton.disabled = false;
    }, 2000);

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
