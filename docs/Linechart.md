# Overview

The line chart visualizes the BMI Data over time.

## Data

Currently the data uses a mock object which contains all datapoints. Later on it should read the necessary data
from the local storage. 

# Integration

To integrate the line chart into the dashboard you can either use
the id `bmi-chart` __or__ you can call the javascript function `plotChart` with a different canvas id.

__NOTE__: The Linechart must be a element of type `<canvas>`
