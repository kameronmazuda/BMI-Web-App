/**
 * @param {string} chartAnchorPoint A id to a canvas element to which the line diagram will be drawn
 * @returns a new Chart.js plot which contains the plotted data
 */
function plotChart(chartAnchorPoint) {
  const chartAnchor = document.getElementById(chartAnchorPoint);
  const plotData = JSON.parse(localStorage.getItem("bmiData")) || [];
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