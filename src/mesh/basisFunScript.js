//   _____   _____               _____                 _                    //
//  |  ___) |  ___)     /\      /  ___)               (_)             _     //
//  | |___  | |___     /  \    | (___     ____   ___   _    ____    _| |_   // 
//  |  ___) |  ___)   / /\ \    \___ \   / ___) |  _) | |  |  _ \  |_   _)  // 
//  | |     | |___   / ____ \   ____) ) | |___  | /   | |  | |_) )   | |    // 
//  |_|     |_____) /_/    \_\ |_____/   \____) |/    |_|  |  __/    | |    // 
//                                                         | |       | |    //
//                                                         |_|       | |    //
//        Website:  www.feacript.com                                 \ __\  //

/**
 * Reurn the linear basis functions for one-dimensional elements
 * @param {*} ksi - Coordinate (ksi) in natural coordinates
 */
export function basisFunLin1D(ksi) {
  let basisFunction = [];
  let basisFunctionDerivative = [];

  // Evaluate basis function
  basisFunction[0] = 1 - ksi;
  basisFunction[1] = ksi;

  // Evaluate the derivative of basis function
  basisFunctionDerivative[0] = -1;
  basisFunctionDerivative[1] = 1;

  // Return the evaluated basis function and derivatives
  return { basisFunction, basisFunctionDerivative };
}

/**
 * Return the quadratic basis functions for rectangular elements
 * @param {*} ksi - First coordinate (ksi) in natural coordinates
 * @param {*} eta - Second coordinate (eta) in natural coordinates
 * @returns
 */
export function basisFunQuad2D(ksi, eta) {
  let basisFunction = [];
  let basisFunctionDerivKsi = [];
  let basisFunctionDerivEta = [];

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

  // Evaluate basis functions
  basisFunction[0] = l1(ksi) * l1(eta);
  basisFunction[1] = l1(ksi) * l2(eta);
  basisFunction[2] = l1(ksi) * l3(eta);
  basisFunction[3] = l2(ksi) * l1(eta);
  basisFunction[4] = l2(ksi) * l2(eta);
  basisFunction[5] = l2(ksi) * l3(eta);
  basisFunction[6] = l3(ksi) * l1(eta);
  basisFunction[7] = l3(ksi) * l2(eta);
  basisFunction[8] = l3(ksi) * l3(eta);

  // Evaluate ksi-derivative of basis functions
  basisFunctionDerivKsi[0] = l1(eta) * dl1(ksi);
  basisFunctionDerivKsi[1] = l2(eta) * dl1(ksi);
  basisFunctionDerivKsi[2] = l3(eta) * dl1(ksi);
  basisFunctionDerivKsi[3] = l1(eta) * dl2(ksi);
  basisFunctionDerivKsi[4] = l2(eta) * dl2(ksi);
  basisFunctionDerivKsi[5] = l3(eta) * dl2(ksi);
  basisFunctionDerivKsi[6] = l1(eta) * dl3(ksi);
  basisFunctionDerivKsi[7] = l2(eta) * dl3(ksi);
  basisFunctionDerivKsi[8] = l3(eta) * dl3(ksi);

  // Evaluate eta-derivative of basis functions
  basisFunctionDerivEta[0] = l1(ksi) * dl1(eta);
  basisFunctionDerivEta[1] = l1(ksi) * dl2(eta);
  basisFunctionDerivEta[2] = l1(ksi) * dl3(eta);
  basisFunctionDerivEta[3] = l2(ksi) * dl1(eta);
  basisFunctionDerivEta[4] = l2(ksi) * dl2(eta);
  basisFunctionDerivEta[5] = l2(ksi) * dl3(eta);
  basisFunctionDerivEta[6] = l3(ksi) * dl1(eta);
  basisFunctionDerivEta[7] = l3(ksi) * dl2(eta);
  basisFunctionDerivEta[8] = l3(ksi) * dl3(eta);

  // Return the evaluated basis functions and derivatives
  return { basisFunction, basisFunctionDerivKsi, basisFunctionDerivEta };
}
