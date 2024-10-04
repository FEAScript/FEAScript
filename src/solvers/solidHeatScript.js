//   ______ ______           _____           _       _     //
//  |  ____|  ____|   /\    / ____|         (_)     | |    //
//  | |__  | |__     /  \  | (___   ___ ____ _ ____ | |_   //
//  |  __| |  __|   / /\ \  \___ \ / __|  __| |  _ \| __|  //
//  | |    | |____ / ____ \ ____) | (__| |  | | |_) | |    //
//  |_|    |______/_/    \_\_____/ \___|_|  |_|  __/| |    //
//                                            | |   | |    //
//                                            |_|   | |_   //
//       Website: https://feascript.com/             \__|  //

import { nodNumStruct2D } from "../mesh/genMeshScript.js";
import { basisFunQuad2D } from "../mesh/basisFunScript.js";
import { Mesh } from "../mesh/genMeshScript.js";

/**
 * Generate the matrix and the residual vector for the Finite Element Method in two dimensions
 * @param {object} meshConfig - Object containing computational mesh details
 * @param {object} boundaryConditions - Object containing boundary conditions
 * @returns
 */
export function createSolidHeatMat2D(meshConfig, boundaryConditions) {
  // Extract mesh details from the configuration object
  const {
    numElementsX, // Number of elements in x-direction
    numElementsY, // Number of elements in y-direction
    maxX, // Max x-coordinate (m) of the domain
    maxY, // Max y-coordinate (m) of the domain
  } = meshConfig;

  // Create a new instance of the Mesh class for 2D mesh generation
  const mesh2D = new Mesh({
    numElementsX,
    numElementsY,
    maxX,
    maxY,
    dimension: "2D",
  });

  // Generate the 2D mesh
  const meshData2D = mesh2D.generateMesh();
  let nodeXCoordinates = meshData2D.nodeXCoordinates;
  let nodeYCoordinates = meshData2D.nodeYCoordinates;
  let totalNodesX = meshData2D.totalNodesX;
  let totalNodesY = meshData2D.totalNodesY;

  // Generate NOP array
  let nop = nodNumStruct2D(
    numElementsX,
    numElementsY,
    totalNodesX,
    totalNodesY
  );

  // Initialize variables for matrix assembly
  const ne = numElementsX * numElementsY; // Total number of elements
  const np = totalNodesX * totalNodesY; // Total number of nodes
  let robinBoundaryFlagTop = new Array(ne).fill(0); // Robin boundary condition flag (elements at the top side of the domain)
  let robinBoundaryFlagBottom = new Array(ne).fill(0); // Robin boundary condition flag (elements at the bottom side of the domain)
  let robinBoundaryFlagLeft = new Array(ne).fill(0); // Robin boundary condition flag (elements at the left side of the domain)
  let robinBoundaryFlagRight = new Array(ne).fill(0); // Robin boundary condition flag (elements at the right side of the domain)
  let dirichletBoundaryFlag = new Array(np).fill(0); // Dirichlet boundary condition flag
  let dirichletBoundaryValue = new Array(np).fill(0); // Dirichlet boundary condition value
  let localNodalNumbers = []; // Local nodal numbering
  let gaussPoints = []; // Gauss points
  let gaussWeights = []; // Gauss weights
  let basisFunctionDerivX = []; // The x-derivative of the basis function
  let basisFunctionDerivY = []; // The y-derivative of the basis function
  let residualVector = []; // Galerkin residuals
  let jacobianMatrix = []; // Jacobian matrix
  let xCoordinates; // x-coordinate (physical coordinates)
  let yCoordinates; // y-coordinate (physical coordinates)
  let ksiDerivX; // ksi-derivative of xCoordinates
  let etaDerivX; // eta-derivative of xCoordinates (ksi and eta are natural coordinates that vary within a reference element)
  let ksiDerivY; // ksi-derivative of yCoordinates
  let etaDerivY; // eta-derivative of yCoordinates
  let detJacobian; // The jacobian of the isoparametric mapping

  // Initialize jacobianMatrix and residualVector arrays
  for (let i = 0; i < np; i++) {
    residualVector[i] = 0;
    jacobianMatrix.push([]);
    for (let j = 0; j < np; j++) {
      jacobianMatrix[i][j] = 0;
    }
  }

  // Extract boundary conditions from the configuration object
  const {
    topBoundary,
    bottomBoundary,
    leftBoundary,
    rightBoundary,
    robinHeatTranfCoeff,
    robinExtTemp,
  } = boundaryConditions;

  // Check for elements to impose Robin boundary conditions
  for (
    let i = 0;
    i < ne - numElementsY;
    i += numElementsY // Elements along yCoordinates=yStart (bottom side of the domain)
  ) {
    if (bottomBoundary[0] == "robin") {
      robinBoundaryFlagBottom[i] = 1;
    }
  }
  for (
    let i = 0;
    i < numElementsY;
    i++ // Elements along xCoordinates=xStart (left side of the domain)
  ) {
    if (leftBoundary[0] == "robin") {
      robinBoundaryFlagLeft[i] = 1;
    }
  }
  for (
    let i = numElementsY - 1;
    i < ne;
    i += numElementsY // Elements along yCoordinates=maxY (top side of the domain)
  ) {
    if (topBoundary[0] == "robin") {
      robinBoundaryFlagTop[i] = 1;
    }
  }
  for (
    let i = ne - numElementsY;
    i < ne;
    i++ // Elements along xCoordinates=maxX (right side of the domain)
  ) {
    if (rightBoundary[0] == "robin") {
      robinBoundaryFlagRight[i] = 1;
    }
  }

  // Matrix assembly
  for (let i = 0; i < ne; i++) {
    for (let j = 0; j < 9; j++) {
      localNodalNumbers[j] = nop[i][j] - 1;
    }

    // Gauss points and weights
    gaussPoints[0] = (1 - (3 / 5) ** 0.5) / 2;
    gaussPoints[1] = 0.5;
    gaussPoints[2] = (1 + (3 / 5) ** 0.5) / 2;
    gaussWeights[0] = 5 / 18;
    gaussWeights[1] = 8 / 18;
    gaussWeights[2] = 5 / 18;

    // Loop over Gauss points
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        // Initialise variables for isoparametric mapping
        let { basisFunction, basisFunctionDerivKsi, basisFunctionDerivEta } =
          basisFunQuad2D(gaussPoints[j], gaussPoints[k]);
        xCoordinates =
          yCoordinates =
          ksiDerivX =
          etaDerivX =
          ksiDerivY =
          etaDerivY =
          detJacobian =
            0;

        // Isoparametric mapping
        for (let n = 0; n < 9; n++) {
          xCoordinates +=
            nodeXCoordinates[localNodalNumbers[n]] * basisFunction[n];
          yCoordinates +=
            nodeYCoordinates[localNodalNumbers[n]] * basisFunction[n];
          ksiDerivX +=
            nodeXCoordinates[localNodalNumbers[n]] * basisFunctionDerivKsi[n];
          etaDerivX +=
            nodeXCoordinates[localNodalNumbers[n]] * basisFunctionDerivEta[n];
          ksiDerivY +=
            nodeYCoordinates[localNodalNumbers[n]] * basisFunctionDerivKsi[n];
          etaDerivY +=
            nodeYCoordinates[localNodalNumbers[n]] * basisFunctionDerivEta[n];
          detJacobian = ksiDerivX * etaDerivY - etaDerivX * ksiDerivY;
        }

        // Compute x-derivative and y-derivative of basis functions
        for (let n = 0; n < 9; n++) {
          basisFunctionDerivX[n] =
            (etaDerivY * basisFunctionDerivKsi[n] -
              ksiDerivY * basisFunctionDerivEta[n]) /
            detJacobian; // The x-derivative of the n basis function
          basisFunctionDerivY[n] =
            (ksiDerivX * basisFunctionDerivEta[n] -
              etaDerivX * basisFunctionDerivKsi[n]) /
            detJacobian; // The y-derivative of the n basis function
        }

        // Computation of Galerkin's residuals and Jacobian matrix
        for (let m = 0; m < 9; m++) {
          let m1 = localNodalNumbers[m];
          residualVector[m1] +=
            gaussWeights[j] * gaussWeights[k] * detJacobian * basisFunction[m];

          for (let n = 0; n < 9; n++) {
            let n1 = localNodalNumbers[n];
            jacobianMatrix[m1][n1] +=
              -gaussWeights[j] *
              gaussWeights[k] *
              detJacobian *
              (basisFunctionDerivX[m] * basisFunctionDerivX[n] +
                basisFunctionDerivY[m] * basisFunctionDerivY[n]);
          }
        }
      }
    }

    // Impose Robin boundary conditions
    /*
    Representation of the nodes in the case of quadratic rectangular elements

      2__5__8
      |     |
      1  4  7
      |__ __|
      0  3  6

    */

    if (
      robinBoundaryFlagTop[i] == 1 ||
      robinBoundaryFlagBottom[i] == 1 ||
      robinBoundaryFlagLeft[i] == 1 ||
      robinBoundaryFlagRight[i] == 1
    ) {
      for (let l = 0; l < 3; l++) {
        let gp1, gp2, firstNode, finalNode, nodeIncr;
        // Set gp1 and gp2 based on boundary conditions
        if (robinBoundaryFlagTop[i] == 1) {
          // Set gp1 and gp2 for elements at the top side of the domain (nodes 2, 5, 8)
          gp1 = gaussPoints[l];
          gp2 = 1;
          firstNode = 2;
          finalNode = 9; // final node minus one
          nodeIncr = 3;
        } else if (robinBoundaryFlagBottom[i] == 1) {
          // Set gp1 and gp2 for elements at the bottom side of the domain (nodes 0, 3, 6)
          gp1 = gaussPoints[l];
          gp2 = 0;
          firstNode = 0;
          finalNode = 7;
          nodeIncr = 3;
        } else if (robinBoundaryFlagLeft[i] == 1) {
          // Set gp1 and gp2 for elements at the left side of the domain (nodes 0, 1, 2)
          gp1 = 0;
          gp2 = gaussPoints[l];
          firstNode = 0;
          finalNode = 3;
          nodeIncr = 1;
        } else if (robinBoundaryFlagRight[i] == 1) {
          // Set gp1 and gp2 for elements at the right side of the domain (nodes 6, 7, 8)
          gp1 = 1;
          gp2 = gaussPoints[l];
          firstNode = 6;
          finalNode = 9;
          nodeIncr = 1;
        }
        // Evaluate the basis functions and their derivatives at the Gauss point
        let { basisFunction, basisFunctionDerivKsi, basisFunctionDerivEta } =
          basisFunQuad2D(gp1, gp2);
        xCoordinates = ksiDerivX = 0;
        for (let k = 0; k < 9; k++) {
          xCoordinates +=
            nodeXCoordinates[localNodalNumbers[k]] * basisFunction[k]; // Interpolate the x-coordinate at the Gauss point
          ksiDerivX +=
            nodeXCoordinates[localNodalNumbers[k]] * basisFunctionDerivKsi[k]; // Interpolate the ksi-derivative of x at the Gauss point
        }
        for (let m = firstNode; m < finalNode; m += nodeIncr) {
          let m1 = localNodalNumbers[m];
          residualVector[m1] +=
            -gaussWeights[l] *
            ksiDerivX *
            basisFunction[m] *
            robinHeatTranfCoeff *
            robinExtTemp; // Add the Robin boundary term to the residual vector
          for (let n = firstNode; n < finalNode; n += nodeIncr) {
            let n1 = localNodalNumbers[n];
            jacobianMatrix[m1][n1] +=
              -gaussWeights[l] *
              ksiDerivX *
              basisFunction[m] *
              basisFunction[n] *
              robinHeatTranfCoeff; // Add the Robin boundary term to the Jacobian matrix
          }
        }
      }
    }
  }

  // Check for elements to impose Dirichlet boundary conditions
  for (
    let i = 0;
    i < np - totalNodesY + 1;
    i += totalNodesY // Define dirichletBoundaryFlag and dirichletBoundaryValue for nodes on yCoordinates=yStart (bottom side of the domain)
  ) {
    if (bottomBoundary[0] == "dirichlet") {
      dirichletBoundaryFlag[i] = 1;
      dirichletBoundaryValue[i] = bottomBoundary[1];
    }
  }
  for (
    let i = 0;
    i < totalNodesY;
    i++ // Define dirichletBoundaryFlag and dirichletBoundaryValue for nodes on xCoordinates=xStart (left side of the domain)
  ) {
    if (leftBoundary[0] == "dirichlet") {
      dirichletBoundaryFlag[i] = 1;
      dirichletBoundaryValue[i] = leftBoundary[1];
    }
  }
  for (
    let i = totalNodesY - 1;
    i < np;
    i += totalNodesY // Define dirichletBoundaryFlag and dirichletBoundaryValue for nodes on yCoordinates=maxY (top side of the domain)
  ) {
    if (topBoundary[0] == "dirichlet") {
      dirichletBoundaryFlag[i] = 1;
      dirichletBoundaryValue[i] = topBoundary[1];
    }
  }
  for (
    let i = np - totalNodesY;
    i < np;
    i++ // Define dirichletBoundaryFlag and dirichletBoundaryValue for nodes on xCoordinates=maxX (right side of the domain)
  ) {
    if (rightBoundary[0] == "dirichlet") {
      dirichletBoundaryFlag[i] = 1;
      dirichletBoundaryValue[i] = rightBoundary[1];
    }
  }

  // Impose Dirichlet boundary conditions
  for (let i = 0; i < np; i++) {
    if (dirichletBoundaryFlag[i] == 1) {
      residualVector[i] = dirichletBoundaryValue[i]; // Set the residual vector to the Dirichlet value
      for (let j = 0; j < np; j++) {
        jacobianMatrix[i][j] = 0; // Set the Jacobian matrix to zero
        jacobianMatrix[i][i] = 1; // Set the diagonal entry to one
      }
    }
  }

  return {
    jacobianMatrix,
    residualVector,
    totalNodesX,
    totalNodesY,
    nodeXCoordinates,
    nodeYCoordinates,
  };
}
