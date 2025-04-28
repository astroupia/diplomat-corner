function readPackage(pkg) {
  // Resolve the conflict between knip and @eslint-community/eslint-utils
  if (pkg.name === "knip") {
    // If there's a conflict in peerDependencies, modify them
    if (pkg.peerDependencies) {
      delete pkg.peerDependencies["@eslint-community/eslint-utils"];
    }
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
