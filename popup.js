/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */

// TODO: Move the following snippet to servlet
// function getUrl() {
//     return window.location.href;
// }

function getPullReqInfo(url, callback, errorCallback) {
    var endpoint = 'https://api.github.com/repos/' + url.substring(19).replace("/pull/", "/pulls/");
    var x = new XMLHttpRequest();
    x.open('GET', endpoint);
    x.responseType = 'json';
    x.onload = function() {
        var response = x.response;
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

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i<vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable){ return pair[1]; }
    }
    return(false);
}

function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

function sendToDB(response, starcount) {
    var positiveText = document.getElementById('positive-text').value;
    var negativeText = document.getElementById('negative-text').value;
}

function isPositiveInteger(str) {
    var n = Math.floor(Number(str));
    return String(n) === str && n >= 0;
}

document.addEventListener('DOMContentLoaded', function() {
    // TODO: Move the following snippet to servlet
    // var url = getUrl();
    // if (url.indexOf("github.com") == -1 || url.indexOf("/pull/") == -1) {
    //     renderStatus('ERROR: Not a Github Pull Request page!');
    // }
    var repoId = getQueryVariable("repo");
    var prId = getQueryVariable("pr");
    if (!isPositiveInteger(repoId) || !isPositiveInteger(prId)) {
        renderStatus('ERROR: Invalid reference to Github Pull Request!');
    }
    else {
        var starCount;
        $('[type*="radio"]').change(function () {
            var me = $(this);
            starCount = me.attr('value');
        });
        renderStatus('Github Pull Request Feedback');
        document.getElementById('submit-button').addEventListener('click', function () {
            getPullReqInfo(url, function (response) {
                sendToDB(response, starCount)
            }, function (errorMessage) {
                renderStatus('ERROR: ' + errorMessage);
            });
        });
    }
});
