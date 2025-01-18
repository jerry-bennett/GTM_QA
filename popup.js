document.getElementById('screenshot').addEventListener('click', async () => {
    const tagName = document.getElementById('tagName').value.trim();
    if (!tagName) {
      alert('Please enter a tag name.');
      return;
    }
  
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    // Find the Tag Assistant tab
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const tagAssistantTab = tabs.find((tab) =>
        tab.title.includes('Tag Assistant') // Update based on the actual title
      );
  
      if (tagAssistantTab) {
        // Switch to Tag Assistant tab
        chrome.tabs.update(tagAssistantTab.id, { active: true }, () => {
          // Inject content script to interact with Tag Assistant
          chrome.scripting.executeScript(
            {
              target: { tabId: tagAssistantTab.id },
              func: interactWithTagAssistant,
              args: [tagName],
            }
          );
        });
      } else {
        alert('Tag Assistant tab not found. Please open it first.');
      }
    });
  });
  
  // Content script function
  function interactWithTagAssistant(tagName) {
    // Helper function to evaluate XPath
    function getElementByXPath(xpath) {
      return document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
    }
  
    // Locate and click the "Summary" button using XPath
    const summaryXPath = '/html/body/div[1]/div[2]/debugger/debugger-content-component/div/div[1]/message-list/div/div[1]';
    const summaryButton = getElementByXPath(summaryXPath);
  
    if (summaryButton) {
      summaryButton.click();
  
      // Wait for tags to load and find the matching one
      setTimeout(() => {
        const tagElement = Array.from(document.querySelectorAll('.tag-row')).find(
          (el) => el.textContent.includes(tagName) && el.textContent.includes('Fired')
        );
  
        if (tagElement) {
          tagElement.click();
  
          // Wait for details to load, then notify background script to take a screenshot
          setTimeout(() => {
            chrome.runtime.sendMessage({ action: 'takeScreenshot' });
          }, 1000);
        } else {
          alert(`Tag "${tagName}" not found with "fired" status.`);
        }
      }, 1000);
    } else {
      alert('Summary button not found.');
    }
  }
  