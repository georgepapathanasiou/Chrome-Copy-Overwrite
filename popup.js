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
  // Replace 'YOUR_API_ENDPOINT_URL' with the actual API endpoint URL
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  // Prepare the request payload
  const payload = {
    message: text,
  };

  // Make a POST request to the API
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Replace 'YOUR_API_KEY' with the actual API key (if required)
      'Authorization': 'Bearer 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',
    },
    body: JSON.stringify(payload),
  })
    .then(response => response.json())
    .then(data => {
      // Process the API response
      if (data && data.response) {
        // Display the response in the popup
        document.getElementById('responseText').innerText = data.response;
      } else {
        document.getElementById('responseText').innerText = 'Error: Invalid API response';
      }
    })
    .catch(error => {
      document.getElementById('responseText').innerText = 'Error: ' + error.message;
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
