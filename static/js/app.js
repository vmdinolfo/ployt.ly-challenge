
// Content for functions DrawBargraph, PopulateMetaData, and InitDashboard
// based on demonstration from class activity.

function optionChanged(newSampleId) {

   // Select panel with meta data and clear for new entry
    var panel = d3.select("#sample-metadata")
    panel.html("");

    // Run Functions to populate page content with new Id
    PopulateMetaData(newSampleId);
    DrawBargraph(newSampleId);
    DrawBubbleChart(newSampleId);
};

function PopulateMetaData(sampleId) {
    
    // Read json and parse data
    d3.json("samples.json").then((data) => {
        
        // Select metadata portion of json
        var metaData = data.metadata;
        // Pull data for sampleId selected in dropdown
        var resultArray = metaData.filter(md => md.id == sampleId);
        // Access results of filtered array
        var result = resultArray[0];
        // Select panel in html to display metadata
        var panel = d3.select("#sample-metadata");

        // Loop through array content to populate key and values in panel
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
        });
    });
};

function DrawBargraph(sampleId) {

    // Read json and parse data
    d3.json("samples.json").then((data) => {
       
        // Select Samples portion of json
        var samples = data.samples;
        // Pull data for SampleId selected in dropdown
        var resultArray = samples.filter(s => s.id == sampleId);
        // Access results of filtered array
        var result = resultArray[0];
        // define variables from array content
        var otu_ids = result.otu_ids;
        var sample_values = result.sample_values;
        var yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();//reverse to display content largest to smallest
        // Select data for Bargraph
        var barData = {
            x: sample_values.slice(0, 10).reverse(),//reverse to match yticks
            y: yticks,
            type: "bar",
            orientation: "h"
        }
        // Define layout for Bargraph
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            yaxis: {
                title: {
                    text: 'OTU Label'
                }
            },
            xaxis: {
                title: {
                    text: 'Sample Size'
                }
            },
            margin: {t: 30, l:150}
        }
        // plot Bargraph
        Plotly.newPlot("bar", [barData], barLayout);
    });
};

function DrawBubbleChart(sampleId) {
   
    // Read json and parse data
   d3.json("samples.json").then((data) => {
       
    // Select Samples portion of json
    var samples = data.samples;
    // Pull data for SampleId selected in dropdown
    var resultArray = samples.filter(s => s.id == sampleId);
    console.log(resultArray);
    // Access results of filtered array
    var result = resultArray[0];
    // define variables from array content
    var otu_ids = result.otu_ids;
    var sample_values = result.sample_values;
    var otu_labels = result.otu_labels

    
    var bubbleChart = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker : {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Portland' 
        }
    };

    var bubbleLayout = {
        title: 'Bacteria Cultures Found',
        xaxis: {
            title : {
                text: 'OTU ID' }
            },
        yaxis: {
            title: {
                text: 'Sample Size'
            }
        },
        height: {autorange: true},
        width: {autorange: true},
        hovermode: "closest"
    }

    Plotly.newPlot("bubble", [bubbleChart], bubbleLayout);
   });
};

function InitDashboard(){
    // select the selector to add data from json to dropdown
    var selector = d3.select("#selDataset");

    // read json file
    d3.json("samples.json").then((data) => {
        console.log(data);

        //Populate the dropdown with IDs from json
        var sampleNames = data.names;
        sampleNames.forEach((sampleId) => {
            selector.append("option")
                .text(sampleId)
                .property("value", sampleId);
            });

        // Get initial sample ID
        var sampleId = sampleNames[0];
        console.log("Starting sample: ", sampleId);
        

        PopulateMetaData(sampleId);
       
        DrawBargraph(sampleId);
        DrawBubbleChart(sampleId);
    }); 
};

InitDashboard();