//   ______ ______           _____           _       _     //
//  |  ____|  ____|   /\    / ____|         (_)     | |    //
//  | |__  | |__     /  \  | (___   ___ ____ _ ____ | |_   //
//  |  __| |  __|   / /\ \  \___ \ / __|  __| |  _ \| __|  //
//  | |    | |____ / ____ \ ____) | (__| |  | | |_) | |    //
//  |_|    |______/_/    \_\_____/ \___|_|  |_|  __/| |    //
//                                            | |   | |    //
//                                            |_|   | |_   //
//       Website: https://feascript.com/             \__|  //

import { assembleSolidHeatMatrix2D } from "./solvers/solidHeatScript.js";

/**
 * Differential equations solver using the finite element method
 * @param {string} solverConfig - Parameter specifying the type of solver
 * @param {object} meshConfig - Object containing computational mesh details
 * @param {object} boundaryConditions - Object containing boundary conditions for the finite element analysis
 * @returns {object} An object containing the solution vector and additional mesh information
 */
export function FEAScript(solverConfig, meshConfig, boundaryConditions) {
  let jacobianMatrix = []; // Jacobian matrix
  let residualVector = []; // Galerkin residuals
  let totalNodesX; // Total number of nodes along x-axis
  let totalNodesY; // Total number of nodes along y-axis
  let nodeXCoordinates = []; // Array to store x-coordinates of nodes (local numbering)
  let nodeYCoordinates = []; // Array to store y-coordinates of nodes (local numbering)
  let solutionVector = []; // Solution vector

  // Assembly matrices
  console.time("assemblyMatrices");
  if (solverConfig === "solidHeatScript") {
    console.log("FEAScript solver:", solverConfig);
    ({
      jacobianMatrix,
      residualVector,
      totalNodesX,
      totalNodesY,
      nodeXCoordinates,
      nodeYCoordinates,
    } = assembleSolidHeatMatrix2D(meshConfig, boundaryConditions));
  }
  console.timeEnd("assemblyMatrices");
  let numNodesX = totalNodesX; // Assign the value of totalNodesX to numNodesX
  let numNodesY = totalNodesY; // Assign the value of totalNodesY to numNodesY

  // System solving
  console.time("systemSolving");
  solutionVector = math.lusolve(jacobianMatrix, residualVector); // Solve the system of linear equations using LU decomposition
  console.timeEnd("systemSolving");

  // Debugger;
  //console.log(x); // Log the solution to the console

  // Return the solution matrix
  return {
    solutionVector,
    numNodesX,
    numNodesY,
    nodeXCoordinates,
    nodeYCoordinates,
  };
}