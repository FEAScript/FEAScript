//   ______ ______           _____           _       _     //
//  |  ____|  ____|   /\    / ____|         (_)     | |    //
//  | |__  | |__     /  \  | (___   ___ ____ _ ____ | |_   //
//  |  __| |  __|   / /\ \  \___ \ / __|  __| |  _ \| __|  //
//  | |    | |____ / ____ \ ____) | (__| |  | | |_) | |    //
//  |_|    |______/_/    \_\_____/ \___|_|  |_|  __/| |    //
//                                            | |   | |    //
//                                            |_|   | |_   //
//       Website: https://feascript.com/             \__|  //

import { assembleSolidHeatTransferMat } from "./solvers/solidHeatTransferScript.js";

/**
 * FEAScript: An open-source JavaScript library to solve differential equations using the finite element method
 * @param {string} solverConfig - Parameter specifying the type of solver
 * @param {object} meshConfig - Object containing computational mesh details
 * @param {object} boundaryConditions - Object containing boundary conditions for the finite element analysis
 * @returns {object} An object containing the solution vector and additional mesh information
 */
export function FEAScript(solverConfig, meshConfig, boundaryConditions) {
  let jacobianMatrix = []; // Jacobian matrix
  let residualVector = []; // Galerkin residuals
  let solutionVector = []; // Solution vector
  let nodesCoordinates = {}; // Object to store x and y coordinates of nodes

  // Assembly matrices
  console.time("assemblyMatrices");
  if (solverConfig === "solidHeatTransferScript") {
    console.log("FEAScript solver:", solverConfig);
    ({ jacobianMatrix, residualVector, nodesCoordinates } = assembleSolidHeatTransferMat(
      meshConfig,
      boundaryConditions
    ));
  }
  console.timeEnd("assemblyMatrices");

  // System solving
  console.time("systemSolving");
  solutionVector = math.lusolve(jacobianMatrix, residualVector); // Solve the system of linear equations using LU decomposition
  console.timeEnd("systemSolving");

  // Debugging statements
  //console.log(x);
  //console.log("nodesCoordinates:", nodesCoordinates);

  // Return the solution matrix and nodes coordinates
  return {
    solutionVector,
    nodesCoordinates,
  };
}
