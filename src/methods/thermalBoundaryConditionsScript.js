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
  constructor(boundaryConditions, boundaryElements, nop, meshDimension, elementOrder) {
    this.boundaryConditions = boundaryConditions;
    this.boundaryElements = boundaryElements;
    this.nop = nop;
    this.meshDimension = meshDimension;
    this.elementOrder = elementOrder;
  }

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
                let xCoordinates = 0;
                let ksiDerivX = 0;
                for (let k = 0; k < 9; k++) {
                  xCoordinates += nodesXCoordinates[this.nop[elementIndex][k] - 1] * basisFunction[k];
                  ksiDerivX += nodesXCoordinates[this.nop[elementIndex][k] - 1] * basisFunctionDerivKsi[k];
                }

                for (let m = firstNode; m < finalNode; m += nodeIncr) {
                  let m1 = this.nop[elementIndex][m] - 1;
                  residualVector[m1] +=
                    -gaussWeights[l] * ksiDerivX * basisFunction[m] * convectionCoeff * extTemp;
                  for (let n = firstNode; n < finalNode; n += nodeIncr) {
                    let n1 = this.nop[elementIndex][n] - 1;
                    jacobianMatrix[m1][n1] +=
                      -gaussWeights[l] * ksiDerivX * basisFunction[m] * basisFunction[n] * convectionCoeff;
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
