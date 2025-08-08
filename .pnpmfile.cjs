// pnpm configuration file for workspace
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Add any package.json modifications here if needed
      return pkg;
    }
  }
};