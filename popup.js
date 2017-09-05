/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

function getPullReqInfo(url, callback, errorCallback) {

  var endpoint = 'https://api.github.com/repos/' + url.substring(19).replace("/pull/", "/pulls/");
  var x = new XMLHttpRequest();
  x.open('GET', endpoint);
  x.responseType = 'json';
  x.onload = function() {
    var response = x.response;
    // TODO: Add not found response check below
    if (!response || response.message == "Not Found") {
      errorCallback('No response from GitHub API!');
      return;
    }
    callback(response);
  };
  x.onerror = function() {
    errorCallback('Network error!');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function sendToDB(response, starcount) {
    var positiveText = document.getElementById('positive-text').value;
    var negativeText = document.getElementById('negative-text').value;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    if (url.indexOf("github.com") == -1 || url.indexOf("/pull/") == -1) {
      renderStatus('ERROR: Not a Github Pull Request page!');
      return;
    }
    var starcount;
    $('[type*="radio"]').change(function () {
    var me = $(this);
    starcount = me.attr('value');
    });
    renderStatus('Github Pull Request Feedback');  
    document.getElementById('submit-button').addEventListener('click', function() {  
    getPullReqInfo(url, function(response) { sendToDB(response, starcount) }, function(errorMessage) {
      renderStatus('ERROR: ' + errorMessage);
    });
  });
});
});
