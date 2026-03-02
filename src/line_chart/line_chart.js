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
 * @returns a new Chart.js plot which contains the plotted data
 */
function plotChart(chartAnchorPoint) {
  const chartAnchor = document.getElementById(chartAnchorPoint);
  const plotData = [];
  const rawPlotData = JSON.parse(localStorage.getItem("bmiData"));
  plotData.push(rawPlotData);
  const configuration = {
    type: "line",
    data: {
      labels: plotData.map((row) => row.timestamp),
      datasets: [
        {
          label: "Body Mass Index",
          data: plotData.map((row) => row.bmi),
        },
      ],
    },
  };

  return new Chart(chartAnchor, configuration);
}

plotChart("bmi-chart");