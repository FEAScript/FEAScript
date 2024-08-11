//   _____   _____               _____                 _                    //
//  |  ___) |  ___)     /\      /  ___)               (_)             _     //
//  | |___  | |___     /  \    | (___     ____   ___   _    ____    _| |_   // 
//  |  ___) |  ___)   / /\ \    \___ \   / ___) |  _) | |  |  _ \  |_   _)  // 
//  | |     | |___   / ____ \   ____) ) | |___  | /   | |  | |_) )   | |    // 
//  |_|     |_____) /_/    \_\ |_____/   \____) |/    |_|  |  __/    | |    // 
//                                                         | |       | |    //
//                                                         |_|       | |    //
//        Website:  www.feacript.com                                 \ __\  //

import { FEAScript } from "../FEAScript.js";

/**
 * Create contour plot of the two-dimensional solution vector
 * @param {*} solutionVector - Solution vector
 * @param {*} numNodesX - Number of nodes along the x-axis
 * @param {*} numNodesY - Number of nodes along the y-axis
 * @param {*} nodeXCoordinates - Array of x-coordinates of nodes
 * @param {*} nodeYCoordinates - Array of y-coordinates of nodes
 */
export function plotSolution2D(
  solutionVector,
  numNodesX,
  numNodesY,
  nodeXCoordinates,
  nodeYCoordinates
) {
  // Reshape the nodeXCoordinates and nodeYCoordinates arrays to match the grid dimensions
  let reshapedXCoordinates = math.reshape(Array.from(nodeXCoordinates), [
    numNodesX,
    numNodesY,
  ]);
  let reshapedYCoordinates = math.reshape(Array.from(nodeYCoordinates), [
    numNodesX,
    numNodesY,
  ]);

  // Reshape the solution array to match the grid dimensions
  let reshapedSolution = math.reshape(Array.from(solutionVector), [
    numNodesX,
    numNodesY,
  ]);

  // Transpose the reshapedX array to get column-wise data
  let transposedSolution = math.transpose(reshapedSolution);

  // Create x array for the contour plot
  let reshapedXForPlot = [];
  for (let i = 0; i < numNodesX * numNodesY; i += numNodesY) {
    let xValue = nodeXCoordinates[i];
    reshapedXForPlot.push(xValue);
  }

  // Create the contour plot data
  let data = [
    {
      z: transposedSolution,
      type: "contour",
      contours: {
        coloring: "heatmap",
      },
      x: reshapedXForPlot,
      y: reshapedYCoordinates[0],
    },
  ];

  // Get the width of the user's screen
  //let maxWindowWidth = window.innerWidth; 

  // Calculate plot dimensions
  let maxWindowWidth = 700; 
  let maxPlotWidth = Math.max(...reshapedXForPlot);
  let maxPlotHeight = Math.max(...reshapedYCoordinates[0]);
  let zoomFactor = maxWindowWidth / maxPlotWidth;
  let plotWidth = zoomFactor * maxPlotWidth;
  let plotHeight = zoomFactor * maxPlotHeight;
  // Debugger;
  //console.log("plotWidth", plotWidth, "plotHeight", plotHeight);

  // Set the layout for the contour plot
  let layout = {
    title: "Solution vector",
    width: plotWidth,
    height: plotHeight,
    // Set constant plot width and height (for testing only)
    //width: 500,
    //height: 500,
    xaxis: { title: "x" },
    yaxis: { title: "y" },
  };

  // Create the contour plot
  Plotly.newPlot("plot", data, layout);
}