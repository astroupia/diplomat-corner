function readPackage(pkg) {
  // Fix specific package issues
  if (pkg.dependencies && pkg.dependencies["@eslint-community/eslint-utils"]) {
    // Force a specific version if needed
    pkg.dependencies["@eslint-community/eslint-utils"] = "4.6.0";
  }

  // Resolve dependency conflicts for knip
  if (pkg.name === "knip") {
    // Fix peer dependencies if needed
    if (pkg.peerDependencies) {
      // Adjust peer dependencies as needed
    }
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
