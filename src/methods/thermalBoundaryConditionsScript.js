//   ______ ______           _____           _       _     //
//  |  ____|  ____|   /\    / ____|         (_)     | |    //
//  | |__  | |__     /  \  | (___   ___ ____ _ ____ | |_   //
//  |  __| |  __|   / /\ \  \___ \ / __|  __| |  _ \| __|  //
//  | |    | |____ / ____ \ ____) | (__| |  | | |_) | |    //
//  |_|    |______/_/    \_\_____/ \___|_|  |_|  __/| |    //
//                                            | |   | |    //
//                                            |_|   | |_   //
//       Website: https://feascript.com/             \__|  //

/**
 * Class to handle thermal boundary conditions application
 */
export class ThermalBoundaryConditions {
  /**
   * Constructor to initialize the ThermalBoundaryConditions class
   * @param {object} boundaryConditions - Object containing boundary conditions for the finite element analysis
   * @param {array} boundaryElements - Array containing elements that belong to each boundary
   * @param {array} nop - Nodal numbering (NOP) array representing the connectivity between elements and nodes
   * @param {string} meshDimension - The dimension of the mesh (e.g., "2D")
   * @param {string} elementOrder - The order of elements (e.g., "linear", "quadratic")
   */
  constructor(boundaryConditions, boundaryElements, nop, meshDimension, elementOrder) {
    this.boundaryConditions = boundaryConditions;
    this.boundaryElements = boundaryElements;
    this.nop = nop;
    this.meshDimension = meshDimension;
    this.elementOrder = elementOrder;
  }

  /**
   * Impose constant temperature boundary conditions (Dirichlet type)
   * @param {array} residualVector - The residual vector to be modified
   * @param {array} jacobianMatrix - The Jacobian matrix to be modified
   */
  imposeConstantTempBoundaryConditions(residualVector, jacobianMatrix) {
    if (this.meshDimension === "2D") {
      Object.keys(this.boundaryConditions).forEach((key) => {
        if (this.boundaryConditions[key][0] === "constantTemp") {
          const tempValue = this.boundaryConditions[key][1];
          this.boundaryElements[key].forEach(([elementIndex, side]) => {
            if (this.elementOrder === "linear") {
              console.log("Unsupported dimension or element order");
            } else if (this.elementOrder === "quadratic") {
              const boundarySides = {
                0: [0, 3, 6], // Nodes at the bottom side of the reference element
                1: [0, 1, 2], // Nodes at the left side of the reference element
                2: [2, 5, 8], // Nodes at the top side of the reference element
                3: [6, 7, 8], // Nodes at the right side of the reference element
              };
              boundarySides[key].forEach((nodeIndex) => {
                const globalNodeIndex = this.nop[elementIndex][nodeIndex] - 1;
                // Set the residual vector to the ConstantTemp value
                residualVector[globalNodeIndex] = tempValue;
                // Set the Jacobian matrix row to zero
                for (let j = 0; j < residualVector.length; j++) {
                  jacobianMatrix[globalNodeIndex][j] = 0;
                }
                // Set the diagonal entry of the Jacobian matrix to one
                jacobianMatrix[globalNodeIndex][globalNodeIndex] = 1;
              });
            }
          });
        }
      });
    }
  }

  /**
   * Impose convection boundary conditions (Robin type)
   * @param {array} residualVector - The residual vector to be modified
   * @param {array} jacobianMatrix - The Jacobian matrix to be modified
   * @param {array} gaussPoints - Array of Gauss points for numerical integration
   * @param {array} gaussWeights - Array of Gauss weights for numerical integration
   * @param {array} nodesXCoordinates - Array of x-coordinates of nodes
   * @param {array} nodesYCoordinates - Array of y-coordinates of nodes
   * @param {object} basisFunctionsData - Object containing basis functions and their derivatives
   * @param {array} convectionHeatTranfCoeff - Array of convection heat transfer coefficients
   * @param {array} convectionExtTemp - Array of external temperatures for convection
   */
  imposeConvectionBoundaryConditions(
    residualVector,
    jacobianMatrix,
    gaussPoints,
    gaussWeights,
    nodesXCoordinates,
    nodesYCoordinates,
    basisFunctionsData,
    convectionHeatTranfCoeff,
    convectionExtTemp
  ) {
    if (this.meshDimension === "2D") {
      Object.keys(this.boundaryConditions).forEach((key) => {
        if (this.boundaryConditions[key][0] === "convection") {
          const convectionCoeff = convectionHeatTranfCoeff[key];
          const extTemp = convectionExtTemp[key];
          this.boundaryElements[key].forEach(([elementIndex, side]) => {
            if (this.elementOrder === "linear") {
              console.log("Unsupported dimension or element order");
            } else if (this.elementOrder === "quadratic") {
              for (let l = 0; l < 3; l++) {
                let gp1, gp2, firstNode, finalNode, nodeIncr;
                if (side === 0) {
                  // Nodes at the bottom side of the reference element
                  gp1 = gaussPoints[l];
                  gp2 = 0;
                  firstNode = 0;
                  finalNode = 7;
                  nodeIncr = 3;
                } else if (side === 1) {
                  // Nodes at the left side of the reference element
                  gp1 = 0;
                  gp2 = gaussPoints[l];
                  firstNode = 0;
                  finalNode = 3;
                  nodeIncr = 1;
                } else if (side === 2) {
                  // Nodes at the top side of the reference element
                  gp1 = gaussPoints[l];
                  gp2 = 1;
                  firstNode = 2;
                  finalNode = 9;
                  nodeIncr = 3;
                } else if (side === 3) {
                  // Nodes at the right side of the reference element
                  gp1 = 1;
                  gp2 = gaussPoints[l];
                  firstNode = 6;
                  finalNode = 9;
                  nodeIncr = 1;
                }
                let basisFunctionsAndDerivatives = basisFunctionsData.getBasisFunctions(gp1, gp2);
                let basisFunction = basisFunctionsAndDerivatives.basisFunction;
                let basisFunctionDerivKsi = basisFunctionsAndDerivatives.basisFunctionDerivKsi;
                let basisFunctionDerivEta = basisFunctionsAndDerivatives.basisFunctionDerivEta;
                let xCoordinates = 0;
                let ksiDerivX = 0;
                let etaDerivY = 0;
                for (let k = 0; k < 9; k++) {
                  xCoordinates += nodesXCoordinates[this.nop[elementIndex][k] - 1] * basisFunction[k];
                  ksiDerivX += nodesXCoordinates[this.nop[elementIndex][k] - 1] * basisFunctionDerivKsi[k];
                  etaDerivY += nodesYCoordinates[this.nop[elementIndex][k] - 1] * basisFunctionDerivEta[k];
                }
                for (let m = firstNode; m < finalNode; m += nodeIncr) {
                  let m1 = this.nop[elementIndex][m] - 1;
                  if (side === 0 || side === 2) {
                    // Horizontal boundaries of the domain (assuming a rectangular domain)
                    residualVector[m1] +=
                      -gaussWeights[l] * ksiDerivX * basisFunction[m] * convectionCoeff * extTemp;
                  } else if (side === 1 || side === 3) {
                    // Vertical boundaries of the domain (assuming a rectangular domain)
                    residualVector[m1] +=
                      -gaussWeights[l] * etaDerivY * basisFunction[m] * convectionCoeff * extTemp;
                  }
                  for (let n = firstNode; n < finalNode; n += nodeIncr) {
                    let n1 = this.nop[elementIndex][n] - 1;
                    if (side === 0 || side === 2) {
                      // Horizontal boundaries of the domain (assuming a rectangular domain)
                      jacobianMatrix[m1][n1] +=
                        -gaussWeights[l] * ksiDerivX * basisFunction[m] * basisFunction[n] * convectionCoeff;
                    } else if (side === 1 || side === 3) {
                      // Vertical boundaries of the domain (assuming a rectangular domain)
                      jacobianMatrix[m1][n1] +=
                        -gaussWeights[l] * etaDerivY * basisFunction[m] * basisFunction[n] * convectionCoeff;
                    }
                  }
                }
              }
            }
          });
        }
      });
    }
  }
}
