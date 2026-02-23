const ctx = document.getElementById("bmiChart");

/*
  Height is profile data.
  Later this can come from:
  - localStorage
  - backend API
  - user profile page
*/
const USER_HEIGHT_CM = 170; // <-- change once, used everywhere
const USER_HEIGHT_M = USER_HEIGHT_CM / 100;

let bmiData = JSON.parse(localStorage.getItem("bmiData")) || [];

function getBMIColor(bmi) {
  if (bmi < 18.5) return "#74c0fc"; // Underweight
  if (bmi < 25) return "#51cf66"; // Normal
  if (bmi < 30) return "#ffa94d"; // Overweight
  return "#ff6b6b"; // Obese
}

const bmiChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: bmiData.map((e) => e.timestamp),
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

function addBMI() {
  const weight = parseFloat(document.getElementById("weight").value);

  if (!weight) {
    alert("Please enter weight");
    return;
  }

  const bmi = +(weight / (USER_HEIGHT_M * USER_HEIGHT_M)).toFixed(1);

  const entry = {
    date: new Date().toLocaleDateString(),
    bmi,
  };

  bmiData.push(entry);

  localStorage.setItem("bmiData", JSON.stringify(bmiData));

  bmiChart.data.labels.push(entry.date);
  bmiChart.data.datasets[0].data.push(entry.bmi);
  bmiChart.data.datasets[0].backgroundColor.push(getBMIColor(entry.bmi));
  bmiChart.update();

  document.getElementById("weight").value = "";
}
