const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils");


const hashMessage = (message) => keccak256(Uint8Array.from(message));

const pubKeyToAddress = (pubKey) => {
  const hash = keccak256(pubKey.slice(1));
  return toHex(hash.slice(-20)).toLowerCase();
};

const signatureToPubKey = (message, signature) => {
  const fullSignatureBytes = hexToBytes(signature);
  const recoveryBit = fullSignatureBytes[0];
  const signatureBytes = fullSignatureBytes.slice(1);

  return secp.recoverPublicKey(hashMessage(message), signatureBytes, recoveryBit);
};

module.exports = {
  hashMessage,
  pubKeyToAddress,
  signatureToPubKey,
};
