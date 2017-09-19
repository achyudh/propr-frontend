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

document.addEventListener('DOMContentLoaded', function() {
    // This is the shortened URL of the repository
    var success = getQueryVariable("success");
    if (success == "True") {
        document.getElementById('div-success').style.visibility = "visible";
    }
    else {
        document.getElementById('div-failure').style.visibility = "visible";
    }
});
