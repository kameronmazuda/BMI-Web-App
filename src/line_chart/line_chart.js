//NOTE(Kay): This will only work when we are using a live server in cases where this is used without a server
//           it will fail miserably. In these cases we should use a local variable which then can be used inside
//           plotChart!

/**
 *
 * @param {string} url path to file
 * @param {*} cb callback to handle the success or error case!
 */
function loadJson(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";

  xhr.onload = () => {
    if (xhr.status === 200) {
      cb(null, xhr.response);
    } else {
      cb(new Error(`HTTP ${xhr.status}`));
    }
  };

  xhr.onerror = () => cb(new Error("Network error while loading JSON"));

  xhr.send();
}

/**
 *
 * @param {string} chartAnchorPoint A id to a canvas element to which the line diagram will be drawn
 * @param {object} data the bmi data to plot (x and y axis)
 * @returns a new Chart.js Plot which contains the plotted data
 */
function plotChart(chartAnchorPoint, data) {
  const chartAnchor = document.getElementById(chartAnchorPoint);
  const plotData = data["data"];
  const configuration = {
    type: "line",
    data: {
      labels: plotData.map((row) => row.date),
      datasets: [
        {
          label: "Body Mass Index",
          data: plotData.map((row) => row.bmi_value),
        },
      ],
    },
  };

  return new Chart(chartAnchor, configuration);
}

loadJson("data_mock.json", (err, jsonData) => {
  if (err) {
    console.error("Failed to load BMI data:", err);
    return;
  }
  plotChart("bmi-chart", jsonData);
});
