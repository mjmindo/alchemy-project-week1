const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const utils = require("./utils");

app.use(cors());
app.use(express.json());


const balances = {
  "84fba3930b881fba04697ddfeb3710708f1f569e": 150,
  "8a9770a8ffc9b4b4090f51cb624acf993c7d3253": 50,
  "73a599071ae57d99707e1ae65b84cf4bc73aa6da": 14,
  "94db1a668e0ba8efaac71d20b75ca02bd2f0b574": 1,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: get a signature from the client side
  // and recover the public address from the signature and set it as the sender
 
  const { message, signature } = req.body;
  const { recipient, amount } = message;

  const pubKey = utils.signatureToPubKey(message, signature);
  const sender = utils.pubKeyToAddress(pubKey);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (sender == recipient) {
    res.status(400).send({ message: "You cannot send money to yourself!" });
  }else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
