import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, toHex } from "ethereum-cryptography/utils";

/**
 * User wallet.
 * This wallet is used to sign messages and to derive the user address.
 * The wallet is initialized with a list of accounts.
 * Each account is identified by a name and contains a private key and a public key.
 * The private key is used to sign messages and the public key is used to derive the user address.
 */

const ACCOUNT_KEYS = new Map([
  [
    "Account 1",
    {
      private:
        "eb065d37e9c0ff4fdd9fded7103119b4e101f514b052df778d13070210de80fe",
      public:
        "0416ee7139914803e8169bb360f2f75b272153fc23bf8429eacac1168b87c6e339f7ecea3dc9b4d83a2372a07994b2852e978882920144ab7b348c1d2634f3ef5e",
    },
  ],
  [
    "Account 2",
    {
      private:
        "48848dc5fa1cb42a8b3b1920ce4399eaa87caedc3fbc527b608162794589746c",
      public:
        "0462f8cec9ff1718c021329c941fa9aa8fdd816152f56f5afec950b0221cd964470c79221cc40c2c6ea767693f51351d006857d69ff09579f27871908cf8ce5f91",
    },
  ],
  [
    "Account 3",
    {
      private:
        "404ad5afbea474a6358543c7553e51bae2425238c31dbb9b36dfa6a3420043bd",
      public:
        "0444901433e7dcd6d4eac0426f0b75b4e9dca7724c09cf1124e39b4388332957d257e8137a7a8f540aeb9a1e72d492d2a26aac2790e292ca0f4f4e9e710db16437",
    },
  ],
  [
    "Account 4",
    {
      private:
        "040f63b1cae2e0ea91d5ca83fe36fa8281e7c5be65309130cfd0f71c6dce7730",
      public:
        "047a012dffcb272734a50d463db322bfb73557c307785f38f598cafa7d8b729afdc0c39902e2415278cc3d13139bbcd897ce425e34cb79cb820bcfb47339d66357",
    },
  ],
]);

// List of users
const USERS = Array.from(ACCOUNT_KEYS.keys());


// Hash a message
const hashMessage = (message) => keccak256(Uint8Array.from(message));


// Get the user public key
const getPublicKey = (user) => {
  if (!user) return null;
  return hexToBytes(ACCOUNT_KEYS.get(user).public);
};

// Get the user private key
const getPrivateKey = (user) => {
  return hexToBytes(ACCOUNT_KEYS.get(user).private);
};

// Get the user address
// The address is derived from the public key
const getAddress = (user) => {
  if (!user) return null;
  const pubKey = getPublicKey(user);
  const hash = keccak256(pubKey.slice(1));
  return toHex(hash.slice(-20)).toLowerCase();
};

// Get the user public key in hexa format
const getHexPubKey = (user) => {
  return toHex(getPublicKey(user)).toLowerCase();
};

// Sign a message
// The message is hashed and signed with the private key
const sign = async (username, message) => {
  const privateKey = getPrivateKey(username);

  const [signature, recoveryBit] = await secp.sign(hashMessage(message), privateKey, {
    recovered: true,
  });
  const fullSignature = new Uint8Array([recoveryBit, ...signature]);
  return toHex(fullSignature);
};

const wallet = {
  USERS,
  sign,
  getAddress,
  getHexPubKey,
};
export default wallet;
