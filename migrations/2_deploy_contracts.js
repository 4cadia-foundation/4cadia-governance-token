const FGToken = artifacts.require("FGToken");

module.exports = function(deployer) {
  deployer.deploy(FGToken);
};
