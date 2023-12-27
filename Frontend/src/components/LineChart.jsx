//Nivo chart component 
import { ResponsiveLine } from "@nivo/line";

//MUI component and theme
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

// Function to format numbers in engineering notation
const formatEngineeringNotation = (value) => {

  const decimalMatch = ('' + value).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);


  const decimalPart = decimalMatch[1] || '';
  if (decimalPart.length > 3 || value > 9999) {
    const exponent = Math.floor(Math.log10(Math.abs(value)));

    const mantissa = value / 10 ** exponent;

    return mantissa.toFixed(2) + 'E' + exponent;


  }
  return value;
};


const LineChart = ({ isDashboard = false, dataToPlot, log_linear, gridValue, mRight, mLeft, itemW, xLegends, yLegends, limitFlag, limitValue, titleGraph }) => {

  //Use theme and colors 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  let plotData = []
  let invalid
  let signalLog = "none"
  let markers = []
  let legends = []
  let gridflag

  //Grid option selected 
  if (gridValue === "grid")
    gridflag = false
  else if (gridValue === "no grid")
    gridflag = true


  //Define legend if not operation graph 
  if (titleGraph === "Parameter Values") {

    legends = [
      {
        anchor: "left",
        direction: "column",
        justify: false,
        translateX: xLegends,
        translateY: yLegends,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: itemW,
        itemHeight: 17,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]



  }

  //Define limit if flag is activated 
  if (limitFlag) {

    markers = [
      {
        axis: 'y',
        lineStyle: {
          stroke: '#b0413e',
          strokeWidth: 1
        },
        value: limitValue
      }
    ]

  }

  //Checks if linear or logaritmic scale and if data is valid to be plotted 
  for (let j = 0; j < dataToPlot.length; j++) {
    invalid = false
    let plot = []
    //LINEAR
    if (log_linear === "linear") {


      for (let i = 0; i < dataToPlot[j]["data"].length; i++) {

        plot[i] = {
          x: '',
          y: '',
        }

        plot[i]['x'] = dataToPlot[j]["data"][i]["x"]
        plot[i]['y'] = dataToPlot[j]["data"][i]["y_linear"]


      }
    }
    //LOGARITMIC 
    else if (log_linear === "log") {


      for (let i = 0; i < dataToPlot[j]["data"].length; i++) {

        plot[i] = {
          x: '',
          y: '',
        }

        plot[i]['x'] = dataToPlot[j]["data"][i]["x"]
        plot[i]['y'] = dataToPlot[j]["data"][i]["y_log"]

        //Checks if data is valid to logaritmic scale 
        if (dataToPlot[j]["data"][i]["y_linear"] <= 0 || dataToPlot[j]["data"][i]["y_log"] === 0)
          invalid = true
        else {
          if (signalLog === "none" && dataToPlot[j]["data"][i]["y_log"] >= 0) {
            signalLog = "pos"
          }
          else if (signalLog === "none" && dataToPlot[j]["data"][i]["y_log"] <= 0) {
            signalLog = "neg"
          }
          else if (signalLog === "pos" && dataToPlot[j]["data"][i]["y_log"] < 0) {
            invalid = true
          }
          else if (signalLog === "neg" && dataToPlot[j]["data"][i]["y_log"] > 0) {
            invalid = true
          }

        }
      }

    }

    //Invalid logaritmic data 
    if (invalid && log_linear === "log")
      continue


    //Checks for not numbers in valid data to convert to null 
    for (let i = 0; i < plot.length; i++) {

      if (plot[i]['x'] === "NaN" || plot[i]['x'] === "Infinity")
        plot[i]['x'] = null

      if (plot[i]['y'] === "NaN" || plot[i]['y'] === "Infinity")
        plot[i]['y'] = null



    }

    //Valid data added 
    let plotBuffer = [{
      id: dataToPlot[j]["id"],
      color: dataToPlot[j]["color"],
      data: plot,
    }]
    plotData.push(plotBuffer[0])




  }



  //Plotdata contains graphs to be plotted in ResponsiveLine component 

  return (
    <ResponsiveLine
      //data
      data={plotData}
      //theme
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // colors
      margin={{ top: 50, right: mRight, bottom: 70, left: mLeft }} //margins defined

      //scales 
      xScale={{
        type: "linear",
        min: "auto",
        max: "auto",
      }}

      yScale={{
        type: log_linear,
        base: 10,
        min: "auto",
        max: "auto",

      }}

      //axis
      markers={markers}
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Frequency (THz)", // added
        legendOffset: 30,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: titleGraph, // added
        legendOffset: -80,
        legendPosition: "middle",
        format: (value) => formatEngineeringNotation(value)

      }}
      //grid 
      enableGridX={gridflag}
      enableGridY={gridflag}
      pointSize={3}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}

      useMesh={true}
      //legend
      legends={legends}
    />
  );
};

export default LineChart;