//   ______ ______           _____           _       _     //
//  |  ____|  ____|   /\    / ____|         (_)     | |    //
//  | |__  | |__     /  \  | (___   ___ ____ _ ____ | |_   //
//  |  __| |  __|   / /\ \  \___ \ / __|  __| |  _ \| __|  //
//  | |    | |____ / ____ \ ____) | (__| |  | | |_) | |    //
//  |_|    |______/_/    \_\_____/ \___|_|  |_|  __/| |    //
//                                            | |   | |    //
//                                            |_|   | |_   //
//       Website: https://feascript.com/             \__|  //

export class FEAMesh {
  /**
   * Constructor to initialize the Mesh object
   * @param {object} config - Configuration object for the mesh
   * @param {number} config.numElementsX - Number of elements along the x-axis
   * @param {number} config.maxX - Maximum x-coordinate of the mesh
   * @param {number} [config.numElementsY=1] - Number of elements along the y-axis (default is 1 for 1D meshes)
   * @param {number} [config.maxY=0] - Maximum y-coordinate of the mesh (default is 0 for 1D meshes)
   * @param {string} [config.dimension='2D'] - The dimension of the mesh, either 1D or 2D (default is 2D)
   * @param {string} [config.meshFile=null] - Optional mesh file (JSON) for predefined meshes
   */
  constructor({
    numElementsX,
    maxX,
    numElementsY = 1,
    maxY = 0,
    dimension = "2D",
    meshFile = null,
  }) {
    this.numElementsX = numElementsX;
    this.numElementsY = numElementsY;
    this.maxX = maxX;
    this.maxY = maxY;
    this.dimension = dimension;
    this.meshFile = meshFile;
  }

  /**
   * Generate the mesh based on the dimension or custom mesh file
   * @returns {object} The generated mesh containing node coordinates and total nodes
   */
  generateMesh() {
    if (this.meshFile) {
      // If a custom mesh file is provided, read and parse it
      const meshData = this.generateMeshFromCustomFile(this.meshFile);
      return meshData;
    } else {
      // Generate mesh based on dimension
      if (this.dimension === "1D") {
        return this.generateMesh1D();
      } else {
        return this.generateMesh2D();
      }
    }
  }

  /**
   * Parse a custom mesh JSON file and generate the mesh
   * @param {string} meshFilePath - Path to the custom mesh file (JSON format)
   * @returns {object} Mesh data containing coordinates and connectivity
   */
  generateMeshFromCustomFile(meshFilePath) {
    const response = fetch(meshFilePath);
    const meshData = response.json();

    const nodeXCoordinates = [];
    const nodeYCoordinates = [];
    const { nodes, elements } = meshData;

    // Parse the node coordinates
    nodes.forEach((node) => {
      nodeXCoordinates.push(node.x);
      nodeYCoordinates.push(node.y);
    });

    return {
      nodeXCoordinates,
      nodeYCoordinates,
      totalNodesX: nodeXCoordinates.length,
      totalNodesY: nodeYCoordinates.length,
      elements,
    };
  }

  /**
   * Generate a one-dimensional mesh along the x-axis
   * The method divides the x-axis into equal segments based on the number of elements
   * @returns {object} An object containing the x-coordinates of the nodes and the total number of nodes along the x-axis
   */
  generateMesh1D() {
    let nodeXCoordinates = [];
    const xStart = 0;
    let totalNodesX = 2 * this.numElementsX + 1;
    const deltaX = (this.maxX - xStart) / this.numElementsX;

    nodeXCoordinates[0] = xStart;
    for (let i = 1; i < totalNodesX; i++) {
      nodeXCoordinates[i] = nodeXCoordinates[i - 1] + deltaX;
    }

    return { nodeXCoordinates, totalNodesX };
  }

  /**
   * Generate a two-dimensional structured mesh.
   * The method creates a structured grid where nodes are placed at regular intervals along the x and y axes
   * @returns {object} An object containing the x and y coordinates and the total number of nodes
   */
  generateMesh2D() {
    let nodeXCoordinates = [];
    let nodeYCoordinates = [];
    const xStart = 0;
    const yStart = 0;
    let totalNodesX = 2 * this.numElementsX + 1;
    let totalNodesY = 2 * this.numElementsY + 1;
    const deltaX = (this.maxX - xStart) / this.numElementsX;
    const deltaY = (this.maxY - yStart) / this.numElementsY;

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

    // Generate nodal numbering (NOP) array
    const nodalNumbering = this.generateNodalNumbering(
      this.numElementsX,
      this.numElementsY,
      totalNodesX,
      totalNodesY
    );

    // Return x and y coordinates of nodes, total nodes, and NOP array
    return {
      nodeXCoordinates,
      nodeYCoordinates,
      totalNodesX,
      totalNodesY,
      nodalNumbering,
    };
  }

  /**
   * Generate the nodal numbering (NOP) array for a 2D structured mesh
   * This array represents the connectivity between elements and their corresponding nodes
   * @param {number} numElementsX - Number of elements along the x-axis
   * @param {number} numElementsY - Number of elements along the y-axis
   * @param {number} totalNodesX - Total number of nodes along the x-axis
   * @param {number} totalNodesY - Total number of nodes along the y-axis
   * @returns {array} NOP - A 2D array which represents the element-to-node connectivity for the entire mesh
   */
  generateNodalNumbering(numElementsX, numElementsY, totalNodesX, totalNodesY) {
    let elementIndex = 0;
    let nop = [];

    for (let i = 0; i < numElementsX * numElementsY; i++) {
      nop.push([]);
      for (let j = 0; j < 9; j++) {
        nop[i][j] = 0;
      }
    }

    /*
    Representation of the nodes in the case of quadratic rectangular elements

      2__5__8
      |     |
      1  4  7
      |__ __|
      0  3  6

    */

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

    return nop;
  }
}