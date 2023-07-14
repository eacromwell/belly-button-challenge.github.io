// Function to build the gauge chart
function buildGaugeChart(wfreq) {
  // Define the levels and corresponding colors for the gauge chart
  const levels = [
    { level: 0, color: 'rgb(49,54,149)' },      // Dark blue
    { level: 1, color: 'rgb(69,117,180)' },
    { level: 2, color: 'rgb(116,173,209)' },
    { level: 3, color: 'rgb(171,217,233)' },
    { level: 4, color: 'rgb(224,243,248)' },  // Light blue
    { level: 5, color: 'rgb(254,224,144)' },
    { level: 6, color: 'rgb(253,174,97)' },
    { level: 7, color: 'rgb(244,109,67)' },
    { level: 8, color: 'rgb(215,48,39)' },
    { level: 9, color: 'rgb(165,0,38)' },    // Dark red
  ];

  // Create the gauge chart data
  const gauge = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: 'Weekly Washing Frequency' },
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
        axis: {
          range: [null, 10],
          ticks: "outside",
          tickvals: [0,1,2,3,4,5,6,7,8,9],
          ticktext:["0","1","2","3","4","5","6","7","8",'9'],
        },
        bar: { color: "red" },
        steps: levels.map(level => ({ range: [level.level, level.level + 1], color: level.color })),
        threshold: {
          line: { color: 'red', width: 4 },
          thickness: 0.75,
          value: wfreq
        }
      }
    }
  ];

  // Create the gauge chart layout
  const layout = {
    width: 400,
    height: 400,
    margin: { t: 0, b: 0 }
  };

  // Plot the gauge chart
  Plotly.newPlot('gaugeChart', gauge, layout);
}

// Function to handle the change event of the dropdown menu
function optionChanged(selectedOption) {
  // Read the JSON data
  d3.json(url).then(data => {
    // Find the selected sample's washing frequency
    const selectedSample = data.metadata.find(sample => sample.id === parseInt(selectedOption));
    const wfreq = selectedSample ? selectedSample.wfreq : 0;

    // Update the gauge chart
    buildGaugeChart(wfreq);
  }).catch(error => {
    console.error("Error loading data:", error);
  });
}

// Add an event listener to the dropdown menu for sample selection
const dropdown = d3.select('#selDataset');
dropdown.on('change', function () {
  const selectedOption = d3.select(this).property('value');
  optionChanged(selectedOption);
});

// Initialize the dashboard with the first sample
optionChanged(dropdown.property('value'));