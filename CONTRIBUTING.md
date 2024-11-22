## Contributing to FEAScript

Thank you for your interest in contributing!</br>
FEAScript is in early development with continuous addition of new features and improvements. To ensure a smooth and collaborative development process, please review and follow the guidelines.

## Contribution Guidelines

<!--1. Search the <a href="https://github.com/FEAScript/FEAScript/wiki/Roadmap" target="_blank">project roadmap</a> to see areas where help is needed.-->

1. Respect the existing FEAScript coding style. Observe the code near your intended change and attempt to preserve that style with your modifications.

2. We recommend using <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode" target="_blank">Prettier</a> plugin for automatic code formatting.

3. Ensure that you use <a href="https://en.wikipedia.org/wiki/Camel_case" target="_blank">camelCase</a> formatting for variable names throughout the code.

4. Before applying for a pull request, you can test your modifications by running the FEAScript library from a local server. For security reasons, it is recommended to use a <a href="https://docs.python.org/3/library/http.server.html" target="_blank">Python HTTP Server</a> by executing the following <a href="https://github.com/FEAScript/FEAScript-website/blob/main/corsHttpServer.py" target="_blank">script</a>. Start the Python server by running `python3 corsHttpServer.py` in your local repository folder. The server address will be http://127.0.0.1:8000/.

   Alternatively, you can disable CORS in your browser for local testing. To disable CORS in Firefox:

   1. Open Firefox and type `about:config` in the address bar, then press Enter.
   2. Accept the risk and continue to the advanced settings.
   3. In the search bar, type `security.fileuri.strict_origin_policy`.
   4. Double-click on the `security.fileuri.strict_origin_policy` preference to set it to `false`.
