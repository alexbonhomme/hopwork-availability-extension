function log(message) {
  chrome.tabs.executeScript({
    code: 'console.log("' + message + '")'
  });
}

function putJSON(url, data) {
  var xhr = new XMLHttpRequest();

  xhr.open("PUT", url, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.onload = function () {
    if (xhr.readyState == 4 && xhr.status == "201") {
      // log(xhr.status);
      // alert('updated!');
    } else {
      log(xhr.status);
      alert("Hopwork extension - update request failed !")
    }
  };

  xhr.send(JSON.stringify(data));
}

function updateAvailability() {
  var url = "https://www.hopwork.fr/api/profile/availability";
  var data = {
    "availability": "AVAILABLE_AND_VERIFIED",
    "label": "AVAILABLE"
  };

  putJSON(url, data);
}

function setNextAlarm(alarmName, timestamp) {
  if (!timestamp) {
    // next week
    timestamp = Date.now() + (1000 * 60 * 60 * 24 * 6);
  }

  // creates alarm
  chrome.alarms.create(alarmName, {
    when: timestamp
  });
}

/**
 *
 */
chrome.runtime.onInstalled.addListener(function () {
  var alarmName = "alarm-1984";

  // set initial alarm
  setNextAlarm(alarmName, Date.now());

  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === alarmName) {
      updateAvailability();

      // set alarm to the next week
      setNextAlarm(alarmName);
    }
  });

  alert('installed!');
});