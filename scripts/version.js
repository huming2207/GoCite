var package_info_json = require('./package.json');

function get_version()
{
    document.getElementById("app-version").innerText = package_info_json.version.toString();
    document.getElementById("env-version").innerText = navigator.appVersion;
    document.getElementById("lang-version").innerText = navigator.language;
}

