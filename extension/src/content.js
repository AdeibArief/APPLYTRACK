chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PAGE_TEXT") {
    const pageText = document.body.innerText;
    const token = localStorage.getItem("token");
    sendResponse({ pageText, token });
  }
  return true;
});