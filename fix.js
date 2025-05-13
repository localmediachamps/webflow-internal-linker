// Simple fix script for Vercel deployment
const fs = require("fs");
const path = require("path");

console.log("Running build fix script...");

// Create mock webworker-threads module to fix natural package
const nodeModulesDir = path.join(process.cwd(), "node_modules");
const webworkerThreadsDir = path.join(nodeModulesDir, "webworker-threads");

if (!fs.existsSync(webworkerThreadsDir)) {
  fs.mkdirSync(webworkerThreadsDir, { recursive: true });
  const indexPath = path.join(webworkerThreadsDir, "index.js");
  const packagePath = path.join(webworkerThreadsDir, "package.json");

  fs.writeFileSync(indexPath, `// Mock module\nmodule.exports = { Worker: function() { return { on: function() {}, postMessage: function() {} }; } };`);
  fs.writeFileSync(packagePath, `{"name":"webworker-threads","version":"0.7.0","main":"index.js"}`);
  console.log("Created mock webworker-threads module");
}

console.log("Build fix completed");
