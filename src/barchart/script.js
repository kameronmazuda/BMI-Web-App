const ctx = document.getElementById("bmiChart");
const bmiData = JSON.parse(localStorage.getItem("bmiData")) || [];

function getBMIColor(bmi) {
  if (bmi < 18.5) return "#74c0fc"; // Underweight
  if (bmi < 25) return "#51cf66"; // Normal
  if (bmi < 30) return "#ffa94d"; // Overweight
  return "#ff6b6b"; // Obese
}

const bmiChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: bmiData?.map((e) => e.timestamp),
    datasets: [
      {
        label: "BMI",
        data: bmiData.map((e) => e.bmi),
        backgroundColor: bmiData.map((e) => getBMIColor(e.bmi)),
        borderRadius: 6,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 15,
        max: 40,
        title: {
          display: true,
          text: "BMI",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  },
});