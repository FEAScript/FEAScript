<img src="https://feascript.github.io/FEAScript-website/images/FEAScriptLogo.png" width="80">

## Heat Conduction in a Two-Dimensional Fin

This example demonstrates how to solve a stationary heat transfer problem within a 2D rectangular domain using the FEAScript library. The problem is a typical cooling fin scenario.

### Files

- `meshConfig.json`: Defines the computational mesh parameters.
- `boundaryConditionsConfig.json`: Specifies the boundary conditions for the problem.
- `FEAScriptExampleSolidHeatTransfer01.html`: The main HTML file that sets up and runs the example.

### CORS Configuration

<p>
  This example requires Cross-Origin Resource Sharing (CORS) to run if the JSON files are stored locally. To
  enable CORS on Firefox, you can follow these steps:
</p>
<ol>
  <li>
    Open Firefox and type <code>about:config</code> in the address bar, then
    press Enter.
  </li>
  <li>Accept the risk and continue to the advanced settings.</li>
  <li>
    In the search bar, type
    <code>security.fileuri.strict_origin_policy</code>.
  </li>
  <li>
    Double-click on the
    <code>security.fileuri.strict_origin_policy</code> preference to set it
    to <code>false</code>.
  </li>
</ol>