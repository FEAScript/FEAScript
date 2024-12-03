## Contributing to FEAScript

Thank you for your interest in contributing! FEAScript is in early development, with continuous additions of new features and improvements. To ensure a smooth and collaborative development process, please review and follow the guidelines below.

## Contribution Guidelines

1. **Respect the existing coding style:** Observe the code near your intended changes and aim to preserve that style in your modifications.

2. **Recommended tools:**  
   We recommend using [Visual Studio Code](https://code.visualstudio.com/) with the [Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for automatic code formatting. Additionally, use a **110-character line width** to maintain consistent formatting.

3. **Naming conventions:**  
   Use [camelCase](https://en.wikipedia.org/wiki/Camel_case) formatting for variable names throughout the code.

4. **Testing changes locally:**  
   Before submitting a pull request, test your modifications by running the FEAScript library from a local directory. For example, you can load the library in your HTML file as follows:

   ```javascript
   import { FEAScriptModel, plotSolution, printVersion } from "[USER_DIRECTORY]/FEAScript-core/src/index.js";
   ```

   For security reasons, it is still recommended to use a local server to handle CORS policies correctly. You can use a <a href="https://docs.python.org/3/library/http.server.html" target="_blank">Python HTTP Server</a> by executing the following <a href="https://github.com/FEAScript/FEAScript-website/blob/main/corsHttpServer.py" target="_blank">script</a> to start a local server:

   ```bash
   python3 corsHttpServer.py
   ```

   The server will be available at:  
   `http://127.0.0.1:8000/`
