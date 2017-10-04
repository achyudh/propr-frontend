function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        Number(value) > -1 &&
        !isNaN(parseInt(value, 10));
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
    document.getElementById('pr-url').textContent = statusText;
}

function sendToDB(star_count, star_count_nodis, necessity, pr_id, repo_id, pr_num, url, return_url, is_private_repo, instid, state) {
    var positive_text = document.getElementById('positive-text').value;
    var negative_text = document.getElementById('negative-text').value;
    var review_time = document.getElementById('review-time').value;
    var file_option = !document.getElementById('file-option').checked;
    // Send feedback DATA as POST request to server
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://chennai.ewi.tudelft.nl:60002/submit", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "action": "feedback",
        "pr_id": pr_id,
        "pr_num":  pr_num,
        "pr_url": return_url,
        "repo_id": repo_id,
        "full_repo_name": url,
        "positive_comments": positive_text,
        "negative_comments": negative_text,
        "rating": star_count,
        "rating_before_discussion": star_count_nodis,
        "necessity": necessity,
        "review_time": review_time,
        "inst_id": instid,
        "is_private_repo": is_private_repo,
        "code_privacy": file_option,
        "state": state,
    }));
    setTimeout(function() {window.location = return_url;}, 10);
    window.location = return_url;
}

function isPositiveInteger(str) {
    var n = Math.floor(Number(str));
    return String(n) === str && n >= 0;
}

function buttonAnimation() {
    document.getElementById("submit-icon").classList.toggle('fa-paper-plane');
    document.getElementById("submit-icon").classList.toggle('fa-check');
    document.getElementById("submit-button").style.background="#4d85d1";
    document.getElementById("submit-button").textContent="Thank you!";
}

function checkHistory(user_id, return_url) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://chennai.ewi.tudelft.nl:60002/feedback", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "action": "history",
        "pr_url": return_url,
        "user_id": user_id
    }));
    if (xhr.status == 200 && xhr.responseText != 'null') {
        var response = JSON.parse(xhr.responseText);
        document.getElementById('negative-text').value = response.positive_comments;
        document.getElementById('positive-text').value = response.negative_comments;
        document.getElementById('review-time').value = response.review_time;
        document.getElementById('rating1').value = response.rating;
        document.getElementById('rating2').value = response.rating_before_discussion;
        document.getElementById('rating3').value = response.necessity;
        document.getElementById('file-option').checked = !response.code_privacy;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // This is the url to redirect the user to when the form is filled
    var return_url = decodeURIComponent(getQueryVariable("returnurl"));
    var user_id = getQueryVariable("userid");
    checkHistory(user_id, return_url);
    // This is the shortened URL of the repository
    var url = decodeURIComponent(getQueryVariable("url"));
    var pr_id = getQueryVariable("prid");
    var repo_id = getQueryVariable("repoid");
    var state = getQueryVariable("state");
    var pr_num = getQueryVariable("prnum");
    var is_private_repo = getQueryVariable("private");
    var installation_id = getQueryVariable("instid");
    if(is_private_repo == "True") {
        document.getElementById('file-option').style.display = "inline";
        document.getElementById('file-option-label').style.display = "inline";
        // document.getElementById('variable-break').style.lineHeight = "450%";
        is_private_repo = true;
    }
    else {
        is_private_repo = false;
    }

    if (url == null || pr_id == null || repo_id == null || return_url == null || pr_num == null) {
        renderStatus('ERROR: Invalid reference to Github Pull Request!');
    }

    else {
        document.getElementById('pr-url').textContent = url;
        var star_count;
        $('[name*="rating1"]').change(function () {
            var me = $(this);
            star_count = me.attr('value');
        });
        var star_count_nodis;
        $('[name*="rating2"]').change(function () {
            var me = $(this);
            star_count_nodis = me.attr('value');
        });
        var necessity;
        $('[name*="rating3"]').change(function () {
            var me = $(this);
            necessity = me.attr('value');
        });
        document.getElementById('submit-button').addEventListener('click', function () {
            var review_time_text = document.getElementById('review-time').value;
            if (isInt(review_time_text, 10) || review_time_text == "") {
                buttonAnimation();
                sendToDB(star_count, star_count_nodis, necessity, pr_id, repo_id, pr_num, url, return_url, is_private_repo, installation_id, state);
            }
            else
                alert("Please enter a number (in minutes) for review time.")
        });
    }
}, {once: true});
