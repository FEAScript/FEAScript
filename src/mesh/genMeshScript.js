//   ______ ______           _____           _       _     //
//  |  ____|  ____|   /\    / ____|         (_)     | |    //
//  | |__  | |__     /  \  | (___   ___ ____ _ ____ | |_   //
//  |  __| |  __|   / /\ \  \___ \ / __|  __| |  _ \| __|  //
//  | |    | |____ / ____ \ ____) | (__| |  | | |_) | |    //
//  |_|    |______/_/    \_\_____/ \___|_|  |_|  __/| |    //
//                                            | |   | |    //
//                                            |_|   | |_   //
//       Website: https://feascript.com/             \__|  //

export class Mesh {
  /**
   * Constructor to initialize the Mesh object
   * @param {object} config - Configuration object for the mesh
   * @param {number} config.numElementsX - Number of elements along the x-axis
   * @param {number} config.maxX - Maximum x-coordinate of the mesh
   * @param {number} [config.numElementsY=1] - Number of elements along the y-axis (default is 1 for 1D meshes)
   * @param {number} [config.maxY=0] - Maximum y-coordinate of the mesh (default is 0 for 1D meshes)
   * @param {string} [config.dimension='2D'] - The dimension of the mesh, either '1D' or '2D' (default is '2D')
   */
  constructor({
    numElementsX,
    maxX,
    numElementsY = 1,
    maxY = 0,
    dimension = "2D",
  }) {
    this.numElementsX = numElementsX; // Number of elements along the x-axis
    this.numElementsY = numElementsY; // Number of elements along the y-axis (1 for 1D, >1 for 2D)
    this.maxX = maxX; // Maximum x-coordinate of the mesh
    this.maxY = maxY; // Maximum y-coordinate of the mesh (only relevant for 2D meshes)
    this.dimension = dimension; // The dimension of the mesh, either '1D' or '2D'
  }

  /**
   * Generate the mesh based on the dimension ('1D' or '2D')
   * This method decides whether to generate a 1D or 2D mesh depending on the `dimension` property
   * @returns {object} The generated mesh containing node coordinates and total nodes
   */
  generateMesh() {
    if (this.dimension === "1D") {
      return this.generate1DMesh(); // Generate 1D mesh if the dimension is '1D'
    } else {
      return this.generate2DMesh(); // Generate 2D mesh if the dimension is '2D'
    }
  }

  /**
   * Generate a one-dimensional mesh along the x-axis
   * The method divides the x-axis into equal segments based on the number of elements
   * @returns {object} An object containing the x-coordinates of the nodes and the total number of nodes along the x-axis
   */
  generate1DMesh() {
    // Initialize arrays and variables
    let nodeXCoordinates = []; // Array to store x-coordinates (global) of nodes
    const xStart = 0; // Starting x-coordinate
    let totalNodesX = 2 * this.numElementsX + 1; // Total number of nodes along x-axis
    const deltaX = (this.maxX - xStart) / this.numElementsX; // Spacing between nodes along x-axis

    // Calculate x coordinates of nodes
    nodeXCoordinates[0] = xStart;
    for (let i = 1; i < totalNodesX; i++) {
      nodeXCoordinates[i] = nodeXCoordinates[i - 1] + deltaX;
    }

    // Return only the x-coordinates and the total number of nodes along the x-axis
    return { nodeXCoordinates, totalNodesX };
  }

  /**
   * Generate a two-dimensional structured mesh.
   * The method creates a structured grid where nodes are placed at regular intervals along the x and y axes
   * @returns {object} An object containing the x and y coordinates of the nodes, and the total number of nodes along the x and y axes
   */
  generate2DMesh() {
    // Initialize arrays and variables
    let nodeXCoordinates = []; // Array to store x-coordinates of nodes (local numbering)
    let nodeYCoordinates = []; // Array to store y-coordinates of nodes (local numbering)
    const xStart = 0; // Starting x-coordinate
    const yStart = 0; // Starting y-coordinate
    let totalNodesX = 2 * this.numElementsX + 1; // Total number of nodes along x-axis
    let totalNodesY = 2 * this.numElementsY + 1; // Total number of nodes along y-axis
    const deltaX = (this.maxX - xStart) / this.numElementsX; // Spacing between nodes along x-axis
    const deltaY = (this.maxY - yStart) / this.numElementsY; // Spacing between nodes along y-axis

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
        nodeYCoordinates[nnode + j] =
          nodeYCoordinates[nnode] + (j * deltaY) / 2;
      }
    }

    // Return the x and y coordinates of the nodes, and the total number of nodes along the x and y axes
    return { nodeXCoordinates, nodeYCoordinates, totalNodesX, totalNodesY };
  }
}

/**
 * Generate the nodal numbering (NOP) array for a two-dimensional structured mesh
 * This array represents the connectivity between elements and their corresponding nodes
 *
 * @param {number} numElementsX - Number of elements along the x-axis
 * @param {number} numElementsY - Number of elements along the y-axis
 * @param {number} totalNodesX - Total number of nodes along the x-axis
 * @param {number} totalNodesY - Total number of nodes along the y-axis
 * @returns {array} NOP - A 2D array where each row corresponds to an element and contains the node numbers connected to that element
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

  // Initialize NOP array with zeros
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

  // Return the NOP array, which represents the element-to-node connectivity for the entire mesh
  return nop;
}