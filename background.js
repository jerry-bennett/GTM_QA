chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'takeScreenshot') {
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        if (dataUrl) {
          chrome.tabs.create({ url: dataUrl });
        } else {
          console.error('Failed to capture screenshot.');
        }
      });
    }
  });
  