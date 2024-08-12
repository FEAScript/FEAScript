//   ______ ______           _____           _       _     //
//  |  ____|  ____|   /\    / ____|         (_)     | |    //
//  | |__  | |__     /  \  | (___   ___ ____ _ ____ | |_   //
//  |  __| |  __|   / /\ \  \___ \ / __|  __| |  _ \| __|  //
//  | |    | |____ / ____ \ ____) | (__| |  | | |_) | |    //
//  |_|    |______/_/    \_\_____/ \___|_|  |_|  __/| |    //
//                                            | |   | |    //
//                                            |_|   | |_   //
//       Website:  www.feacript.com                  \__|  //

/**
 * Generate one-dimensional mesh
 * @param {*} numElementsX - Number of elements along the x-axis
 * @param {*} maxX - Last x-coordinate of the mesh
 * @returns
 */
export function genMesh1D(numElementsX, maxX) {
  // Initialize arrays and variables
  let nodeXCoordinates = []; // Array to store x-coordinates (global) of nodes
  const xStart = 0; // Starting x-coordinate
  let totalNodesX = 2 * numElementsX + 1; // Total number of nodes along x-axis
  const deltaX = (maxX - xStart) / numElementsX; // Spacing between nodes along x-axis

  // Calculate x coordinates of nodes
  nodeXCoordinates[0] = xStart;
  for (let i = 1; i < totalNodesX; i++) {
    nodeXCoordinates[i] = nodeXCoordinates[i - 1] + deltaX;
  }

  // Return the generated coordinates and mesh information
  return { nodeXCoordinates, totalNodesX };
}

/**
 * Generate two-dimensional structured mesh
 * @param {*} numElementsX - Number of elements along the x-axis
 * @param {*} numElementsY - Number of elements along the y-axis
 * @param {*} maxX - Last x-coordinate of the mesh
 * @param {*} maxY - Last y-coordinate of the mesh
 * @returns
 */
export function genStructMesh2D(numElementsX, numElementsY, maxX, maxY) {
  // Initialize arrays and variables
  let nodeXCoordinates = []; // Array to store x-coordinates of nodes (local numbering)
  let nodeYCoordinates = []; // Array to store y-coordinates of nodes (local numbering)
  const xStart = 0; // Starting x-coordinate
  const yStart = 0; // Starting y-coordinate
  let totalNodesX = 2 * numElementsX + 1; // Total number of nodes along x-axis
  let totalNodesY = 2 * numElementsY + 1; // Total number of nodes along y-axis
  const deltaX = (maxX - xStart) / numElementsX; // Spacing between nodes along x-axis
  const deltaY = (maxY - yStart) / numElementsY; // Spacing between nodes along y-axis

  // Calculate x-y global coordinates of nodes
  nodeXCoordinates[0] = xStart;
  nodeYCoordinates[0] = yStart;
  for (let i = 1; i < totalNodesY; i++) {
    nodeXCoordinates[i] = nodeXCoordinates[0];
    nodeYCoordinates[i] = nodeYCoordinates[0] + (i * deltaY) / 2;
  }
  for (let i = 1; i < totalNodesX; i++) {
    const nnode = i * totalNodesY;
    nodeXCoordinates[nnode] = nodeXCoordinates[0] + (i * deltaX) / 2;
    nodeYCoordinates[nnode] = nodeYCoordinates[0];
    for (let j = 1; j < totalNodesY; j++) {
      nodeXCoordinates[nnode + j] = nodeXCoordinates[nnode];
      nodeYCoordinates[nnode + j] = nodeYCoordinates[nnode] + (j * deltaY) / 2;
    }
  }

  // Return the generated coordinates and mesh information
  return { nodeXCoordinates, nodeYCoordinates, totalNodesX, totalNodesY };
}

/**
 * Generate nop array for two-dimensional structured mesh
 * @param {*} numElementsX - Number of elements along the x-axis
 * @param {*} numElementsY - Number of elements along the y-axis
 * @param {*} totalNodesX - Total number of nodes along the x-axis
 * @param {*} totalNodesY - Total number of nodes along the y-axis
 * @returns
 */
export function nodNumStruct2D(
  numElementsX,
  numElementsY,
  totalNodesX,
  totalNodesY
) {
  // Nodal numbering
  let elementIndex = 0;
  let nop = [];

  // Initialize nop array with zeros
  for (let i = 0; i < numElementsX * numElementsY; i++) {
    nop.push([]);
    for (let j = 0; j < 9; j++) {
      nop[i][j] = 0;
    }
  }

  // Assign node numbers to elements
  for (let i = 1; i <= numElementsX; i++) {
    for (let j = 1; j <= numElementsY; j++) {
      for (let k = 1; k <= 3; k++) {
        let l = 3 * k - 2;
        nop[elementIndex][l - 1] = totalNodesY * (2 * i + k - 3) + 2 * j - 1;
        nop[elementIndex][l] = nop[elementIndex][l - 1] + 1;
        nop[elementIndex][l + 1] = nop[elementIndex][l - 1] + 2;
      }
      elementIndex = elementIndex + 1;
    }
  }

  // Return the generated nop array
  return nop;
}
