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
 * Check if only one boundary conditions is applied to each side of the domain for the solidHeatScript solver
 * @param {Object} boundaryConditions - An object representing the applied boundary conditions
 */
export function chkSolidHeatboundaryConditions(boundaryConditions) {
  const boundaryConditionCounts = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  if (boundaryConditions.robinTop) boundaryConditionCounts.top++;
  if (boundaryConditions.robinBottom) boundaryConditionCounts.bottom++;
  if (boundaryConditions.robinLeft) boundaryConditionCounts.left++;
  if (boundaryConditions.robinRight) boundaryConditionCounts.right++;
  if (boundaryConditions.dirichletTop) boundaryConditionCounts.top++;
  if (boundaryConditions.dirichletBottom) boundaryConditionCounts.bottom++;
  if (boundaryConditions.dirichletLeft) boundaryConditionCounts.left++;
  if (boundaryConditions.dirichletRight) boundaryConditionCounts.right++;

  let moreThanOneBoundaryCondition = "";
  let multipleCount = 0;

  for (const side in boundaryConditionCounts) {
    if (boundaryConditionCounts[side] > 1) {
      moreThanOneBoundaryCondition += `${side} `;
      multipleCount++;
    }
  }

  if (multipleCount > 0) {
    console.log(
      `chkSolidHeatboundaryConditions: Fail - More than one boundary condition is applied on the following side(s): ${moreThanOneBoundaryCondition}`
    );
  } else {
    console.log(
      "chkSolidHeatboundaryConditions: Success - Only one boundary condition is applied on each side"
    );
  }
}

/**
 * Print the FEAScript version
 */
export function CFDScriptVersion() {
  console.log("FEAScript version:", new Date().getFullYear());
}
