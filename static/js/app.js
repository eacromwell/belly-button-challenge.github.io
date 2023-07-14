// Set the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Function to initialize the dashboard
function init() {
  // Load data from the JSON file
  d3.json(url)
    .then(data => {
      // Get the samples data
      const samples = data.samples;

      // Get the dropdown select element
      const dropdown = d3.select("#selDataset");

      // Populate the dropdown with options
      samples.forEach(sample => {
        dropdown.append("option")
          .attr("value", sample.id)
          .text(sample.id);
      });

      // Set the initial value for the dropdown
      const initialSampleId = samples[0].id;
      updateCharts(initialSampleId);
      buildGaugeChart(initialSampleId);
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
}

// Function to update the bar chart and bubble chart, and display metadata based on the selected sample
function updateCharts(selectedOption) {
  // Load data from the JSON file
  d3.json(url)
    .then(data => {
      // Get the samples and metadata data
      const samples = data.samples;
      const metadata = data.metadata;

      // Find the selected sample by its ID
      const selectedSample = samples.find(sample => sample.id === selectedOption);

      if (selectedSample) {
        const sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
        const otuIds = selectedSample.otu_ids.slice(0, 10).reverse();
        const otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();

        const barTrace = {
          x: sampleValues,
          y: otuIds.map(id => `OTU ${id}`),
          text: otuLabels,
          type: "bar",
          orientation: "h"
        };

        const barLayout = {
          title: "Top 10 OTUs",
          xaxis: { title: "Sample Values" },
          yaxis: { title: "OTU IDs" }
        };

        Plotly.newPlot("bar", [barTrace], barLayout);

        const bubbleTrace = {
          x: selectedSample.otu_ids,
          y: selectedSample.sample_values,
          text: otuLabels,
          mode: "markers",
          marker: {
            size: selectedSample.sample_values,
            color: selectedSample.otu_ids,
            colorscale: "Earth"
          }
        };

        const bubbleLayout = {
          title: "OTU ID vs Sample Values",
          xaxis: { title: "OTU ID" },
          yaxis: { title: "Sample Values" },
          autosize: true,
        };

        Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

        // Display metadata for the selected sample
        const selectedMetadata = metadata.find(entry => entry.id === parseInt(selectedOption));
        if (selectedMetadata) {
          const sampleMetadata = d3.select("#sample-metadata");
          sampleMetadata.html("");
          Object.entries(selectedMetadata).forEach(([key, value]) => {
            sampleMetadata.append("p")
              .text(`${key}: ${value}`);
          });
        } else {
          console.error("Selected sample metadata not found");
        }
      } else {
        console.error("Selected sample not found");
      }
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
}

// Function to build the gauge chart
function buildGaugeChart(selectedOption) {
  // Load data from the JSON file
  d3.json(url)
    .then(data => {
      // Get the metadata data
      const metadata = data.metadata;

      // Find the selected sample's washing frequency
      const selectedMetadata = metadata.find(entry => entry.id === parseInt(selectedOption));
      const wfreq = selectedMetadata ? selectedMetadata.wfreq : 0;

      // Define the levels and corresponding colors for the gauge chart
      const levels = [
        { level: 0, color: "rgb(49,54,149)" },      // Dark blue
        { level: 1, color: "rgb(69,117,180)" },
        { level: 2, color: "rgb(116,173,209)" },
        { level: 3, color: "rgb(171,217,233)" },
        { level: 4, color: "rgb(224,243,248)" },  // Light blue
        { level: 5, color: "rgb(254,224,144)" },
        { level: 6, color: "rgb(253,174,97)" },
        { level: 7, color: "rgb(244,109,67)" },
        { level: 8, color: "rgb(215,48,39)" },
        { level: 9, color: "rgb(165,0,38)" },    // Dark red
      ];

      // Create the gauge chart data
      const gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: "Weekly Washing Frequency" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: {
              range: [null, 9],
              ticks: "outside",
              tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
              ticktext: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
            },
            bar: { color: "red" },
            steps: levels.map(level => ({
              range: [level.level, level.level + 1],
              color: level.color
            })),
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: wfreq
            }
          }
        }
      ];

      // Create the gauge chart layout
      const gaugeLayout = {
        width: 400,
        height: 400,
        margin: { t: 0, b: 0 }
      };

      // Plot the gauge chart
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
}

// Function to handle dropdown selection change
function optionChanged(sampleId) {
  updateCharts(sampleId);
  buildGaugeChart(sampleId);
}

// Call the init function to initialize the dashboard
init();