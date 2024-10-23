//   ______ ______           _____           _       _     //
//  |  ____|  ____|   /\    / ____|         (_)     | |    //
//  | |__  | |__     /  \  | (___   ___ ____ _ ____ | |_   //
//  |  __| |  __|   / /\ \  \___ \ / __|  __| |  _ \| __|  //
//  | |    | |____ / ____ \ ____) | (__| |  | | |_) | |    //
//  |_|    |______/_/    \_\_____/ \___|_|  |_|  __/| |    //
//                                            | |   | |    //
//                                            |_|   | |_   //
//       Website: https://feascript.com/             \__|  //

export class FEAElementFunctions {
  /**
   * Constructor to initialize the FEAElementFunctions class
   * @param {string} dimension - The dimension of the element ('1D' or '2D')
   * @param {number} order - The order of the element
   */
  constructor({ dimension, order }) {
    this.dimension = dimension;
    this.order = order;
  }

  /**
   * Return the basis functions and their derivatives based on the dimension and order
   * @param {number} ksi - Natural coordinate (for both 1D and 2D)
   * @param {number} [eta] - Second natural coordinate (only for 2D elements)
   * @returns {object} An object containing:
   *  - basisFunction: Array of evaluated basis functions
   *  - basisFunctionDerivKsi: Array of derivatives of basis functions with respect to ksi
   *  - basisFunctionDerivEta: Array of derivatives of basis functions with respect to eta (if 2D)
   */
  getBasisFunctions(ksi, eta) {
    if (this.dimension === "1D" && this.order === 1) {
      return this.linearBasisFunctions1D(ksi);
    } else if (this.dimension === "2D" && this.order === 2) {
      if (eta === null) {
        console.log("Eta coordinate is required for 2D elements");
      }
      return this.quadraticBasisFunctions2D(ksi, eta);
    } else {
      console.log("Unsupported dimension or element order");
    }
  }

  /**
   * Return the linear basis functions for one-dimensional elements
   * @param {number} ksi - Coordinate (ksi) in natural coordinates
   * @returns {object} An object containing:
   *  - basisFunction: Array of evaluated basis functions at the given ksi
   *  - basisFunctionDerivKsi: Array of derivatives of the basis functions with respect to ksi
   */
  linearBasisFunctions1D(ksi) {
    let basisFunction = [];
    let basisFunctionDerivKsi = [];

    // Evaluate basis functions
    basisFunction[0] = 1 - ksi;
    basisFunction[1] = ksi;

    // Evaluate the derivatives of basis functions
    basisFunctionDerivKsi[0] = -1;
    basisFunctionDerivKsi[1] = 1;

    // Return the evaluated basis functions and derivatives
    return { basisFunction, basisFunctionDerivKsi };
  }

  /**
   * Return the quadratic basis functions for rectangular elements in 2D
   * @param {number} ksi - First natural coordinate
   * @param {number} eta - Second natural coordinate
   * @returns {object} An object containing:
   *  - basisFunction: Array of evaluated quadratic basis functions at the given (ksi, eta)
   *  - basisFunctionDerivKsi: Array of derivatives of basis functions with respect to ksi
   *  - basisFunctionDerivEta: Array of derivatives of basis functions with respect to eta
   */
  quadraticBasisFunctions2D(ksi, eta) {
    let basisFunction = [];
    let basisFunctionDerivKsi = [];
    let basisFunctionDerivEta = [];

    // Define the shape functions and their derivatives for quadratic elements
    function l1(c) {
      return 2 * c ** 2 - 3 * c + 1;
    }
    function l2(c) {
      return -4 * c ** 2 + 4 * c;
    }
    function l3(c) {
      return 2 * c ** 2 - c;
    }
    function dl1(c) {
      return 4 * c - 3;
    }
    function dl2(c) {
      return -8 * c + 4;
    }
    function dl3(c) {
      return 4 * c - 1;
    }

    // Evaluate basis functions at (ksi, eta)
    basisFunction[0] = l1(ksi) * l1(eta);
    basisFunction[1] = l1(ksi) * l2(eta);
    basisFunction[2] = l1(ksi) * l3(eta);
    basisFunction[3] = l2(ksi) * l1(eta);
    basisFunction[4] = l2(ksi) * l2(eta);
    basisFunction[5] = l2(ksi) * l3(eta);
    basisFunction[6] = l3(ksi) * l1(eta);
    basisFunction[7] = l3(ksi) * l2(eta);
    basisFunction[8] = l3(ksi) * l3(eta);

    // Evaluate derivatives with respect to ksi
    basisFunctionDerivKsi[0] = dl1(ksi) * l1(eta);
    basisFunctionDerivKsi[1] = dl1(ksi) * l2(eta);
    basisFunctionDerivKsi[2] = dl1(ksi) * l3(eta);
    basisFunctionDerivKsi[3] = dl2(ksi) * l1(eta);
    basisFunctionDerivKsi[4] = dl2(ksi) * l2(eta);
    basisFunctionDerivKsi[5] = dl2(ksi) * l3(eta);
    basisFunctionDerivKsi[6] = dl3(ksi) * l1(eta);
    basisFunctionDerivKsi[7] = dl3(ksi) * l2(eta);
    basisFunctionDerivKsi[8] = dl3(ksi) * l3(eta);

    // Evaluate derivatives with respect to eta
    basisFunctionDerivEta[0] = l1(ksi) * dl1(eta);
    basisFunctionDerivEta[1] = l1(ksi) * dl2(eta);
    basisFunctionDerivEta[2] = l1(ksi) * dl3(eta);
    basisFunctionDerivEta[3] = l2(ksi) * dl1(eta);
    basisFunctionDerivEta[4] = l2(ksi) * dl2(eta);
    basisFunctionDerivEta[5] = l2(ksi) * dl3(eta);
    basisFunctionDerivEta[6] = l3(ksi) * dl1(eta);
    basisFunctionDerivEta[7] = l3(ksi) * dl2(eta);
    basisFunctionDerivEta[8] = l3(ksi) * dl3(eta);

    // Return the evaluated basis functions and their derivatives
    return { basisFunction, basisFunctionDerivKsi, basisFunctionDerivEta };
  }

  /**
   * Return Gauss points and weights based on element configuration
   * @returns {object} An object containing:
   *  - gaussPoints: Array of Gauss points
   *  - gaussWeights: Array of Gauss weights
   */
  getGaussPointsAndWeights() {
    let gaussPoints = []; // Gauss points
    let gaussWeights = []; // Gauss weights

    if (this.dimension === "1D" && this.order === 1) {
      console.log("Unsupported dimension or element order");
    } else if (this.dimension === "2D" && this.order === 2) {
      // For 2D quadratic elements, use 3-point Gauss quadrature in each direction
      gaussPoints[0] = (1 - Math.sqrt(3 / 5)) / 2;
      gaussPoints[1] = 0.5;
      gaussPoints[2] = (1 + Math.sqrt(3 / 5)) / 2;
      gaussWeights[0] = 5 / 18;
      gaussWeights[1] = 8 / 18;
      gaussWeights[2] = 5 / 18;
    } else {
      console.log("Unsupported dimension or element order");
    }

    return { gaussPoints, gaussWeights };
  }
}