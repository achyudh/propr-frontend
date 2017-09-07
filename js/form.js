/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */

function getUrl() {
    return window.location.href;
}

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
    for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable){ return pair[1]; }
    }
    return(false);
}

function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

function sendToDB(starcount, pr_id, repo_id) {
    var positiveText = document.getElementById('positive-text').value;
    var negativeText = document.getElementById('negative-text').value;

    // Send form DATA as POST request to server
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://dutiap.st.ewi.tudelft.nl:60002/webhook", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "action": "submit",
        "pr_id": pr_id,
        "repo_id": repo_id,
        "positive_comments": positiveText,
        "negative_comments": negativeText,
        "rating": starcount
    }));

    alert("Thank you for your feedback!");
}

function isPositiveInteger(str) {
    var n = Math.floor(Number(str));
    return String(n) === str && n >= 0;
}

document.addEventListener('DOMContentLoaded', function() {
    var url = decodeURIComponent(getQueryVariable("url"));
    var pr_id = decodeURIComponent(getQueryVariable("prid"));
    var repo_id = decodeURIComponent(getQueryVariable("repoid"));
    // Use this encoded URI for testing:
    // https%3A%2F%2Fgithub.com%2Fprasadtalasila%2FMailingListParser%2Fpull%2F54
    if (url == null || pr_id == null || repo_id == null) {
        renderStatus('ERROR: Invalid reference to Github Pull Request!');
    }
    else {
        document.getElementById('pr-url').textContent = url;
        var starCount;
        $('[type*="radio"]').change(function () {
            var me = $(this);
            starCount = me.attr('value');
        });
        renderStatus('Github Pull Request Feedback');
        document.getElementById('submit-button').addEventListener('click', function () {
                sendToDB(starCount, pr_id, repo_id);
        });
    }
});
