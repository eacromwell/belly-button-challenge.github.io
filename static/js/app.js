// Below is the app.js for the Belly Button Biodiversity Dashboard.

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
      updateBarChart(initialSampleId);
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
}

// Update the bar chart and bubble chart, and display metadata based on the selected sample
function updateBarChart(selectedOption) {
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

// Function to handle dropdown selection change
function optionChanged(sampleId) {
  updateBarChart(sampleId);
}

// Call the init function to initialize the dashboard
init();