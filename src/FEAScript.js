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
 * FEAScript: An open-source finite element simulation library developed in JavaScript
 * @param {string} solverConfig - Parameter specifying the type of solver
 * @param {object} meshConfig - Object containing computational mesh details
 * @param {object} boundaryConditions - Object containing boundary conditions for the finite element analysis
 * @returns {object} An object containing the solution vector and additional mesh information
 */
export class FEAScriptModel {
  constructor() {
    this.solverConfig = null;
    this.meshConfig = {};
    this.boundaryConditions = {};
    this.solverMethod = "lusolve"; // Default solver method
  }

  setSolverConfig(solverConfig) {
    this.solverConfig = solverConfig;
  }

  setMeshConfig(meshConfig) {
    this.meshConfig = meshConfig;
  }

  addBoundaryCondition(boundaryKey, condition) {
    this.boundaryConditions[boundaryKey] = condition;
  }

  setSolverMethod(solverMethod) {
    this.solverMethod = solverMethod;
  }

  solve() {
    if (!this.solverConfig || !this.meshConfig || !this.boundaryConditions) {
      throw new Error("Solver config, mesh config, and boundary conditions must be set before solving.");
    }

    let jacobianMatrix = []; // Jacobian matrix
    let residualVector = []; // Galerkin residuals
    let solutionVector = []; // Solution vector
    let nodesCoordinates = {}; // Object to store x and y coordinates of nodes

    // Assembly matrices
    console.time("assemblyMatrices");
    if (this.solverConfig === "solidHeatTransferScript") {
      console.log("FEAScript solver:", this.solverConfig);
      ({ jacobianMatrix, residualVector, nodesCoordinates } = assembleSolidHeatTransferMat(
        this.meshConfig,
        this.boundaryConditions
      ));
    }
    console.timeEnd("assemblyMatrices");

    // System solving
    console.time("systemSolving");
    if (this.solverMethod === "lusolve") {
      solutionVector = math.lusolve(jacobianMatrix, residualVector); // Solve the system of linear equations using LU decomposition
    }
    console.timeEnd("systemSolving");

    // Return the solution matrix and nodes coordinates
    return {
      solutionVector,
      nodesCoordinates,
    };
  }
}
