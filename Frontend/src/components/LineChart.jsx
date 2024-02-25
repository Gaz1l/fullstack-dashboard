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


const LineChart = ({ isDashboard = false, dataToPlot, log_linear, log_linear_values, gridValue, mRight, mLeft, itemW, xLegends, yLegends, limitFlag, limitValue, titleGraph }) => {

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


  console.log(log_linear)
  console.log(log_linear_values)
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
console.log(dataToPlot)
  //Checks if linear or logaritmic scale and if data is valid to be plotted 
  for (let j = 0; j < dataToPlot.length; j++) {

    let bufferLin = []
    let bufferLog = [] 
    let tempLin = [] 
    let tempLog = [] 

    //Buffer in required format without NaN and Infinity  
    for (let a = 0; a < dataToPlot[j]["data"].length; a++) {

      tempLin = {
        x: '',
        y: '',
      }
      
      tempLog = {
        x: '',
        y: '',
      }

      if (dataToPlot[j]["data"][a]["y_linear"] !== "NaN" && dataToPlot[j]["data"][a]["y_linear"] !== "Infinity" &&dataToPlot[j]["data"][a]["y_linear"] !== "-Infinity" && isFinite(dataToPlot[j]["data"][a]["y_linear"])){
        tempLin['y'] = dataToPlot[j]["data"][a]["y_linear"]
        tempLin['x'] = dataToPlot[j]["data"][a]["x"]
        bufferLin.push(tempLin)
      }
      if (dataToPlot[j]["data"][a]["y_log"] !== "NaN" && dataToPlot[j]["data"][a]["y_log"] !== "Infinity" &&dataToPlot[j]["data"][a]["y_log"] !== "-Infinity" && isFinite(dataToPlot[j]["data"][a]["y_log"])){
        tempLog['y'] = dataToPlot[j]["data"][a]["y_log"] 
        tempLog['x'] = dataToPlot[j]["data"][a]["x"]
        bufferLog.push(tempLog)
      }





      
    }

    console.log(bufferLin)
    //console.log(buffer)
    invalid = false
    let plot = []
    //LINEAR
    if (log_linear_values === "linear") {


      for (let i = 0; i < bufferLin.length; i++) {

        plot[i] = {
          x: '',
          y: '',
        }

        plot[i]['x'] = bufferLin[i]["x"]
        plot[i]['y'] = bufferLin[i]["y"]


      }
    }
    //LOGARITMIC 
    else if (log_linear_values === "log") {


      for (let i = 0; i < bufferLog.length; i++) {

        plot[i] = {
          x: '',
          y: '',
        }

        plot[i]['x'] = bufferLog[i]["x"]
        plot[i]['y'] = bufferLog[i]["y"]
      }
    }

    if (log_linear === "log") {
      for (let i = 0; i < plot.length; i++) {
        //Checks if data is valid to logaritmic scale 
        if (plot[i]["y"] === 0)
          invalid = true
        else {
          if (signalLog === "none" && plot[i]["y"] >= 0) {
            signalLog = "pos"
          }
          else if (signalLog === "none" && plot[i]["y"] <= 0) {
            signalLog = "neg"
          }
          else if (signalLog === "pos" && plot[i]["y"] <= 0) {
            invalid = true
          }
          else if (signalLog === "neg" && plot[i]["y"] >= 0) {
            invalid = true
          }

        }
      }
    }



    //Invalid logaritmic data 
    if (invalid && log_linear === "log")
      continue




    //console.log(buffer)
    console.log(plot)
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
      curve="monotoneX"
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