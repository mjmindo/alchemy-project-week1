import server from "./server";
import userWallet from "./UserWallet";

function Wallet({ user, setUser, balance, setBalance }) {

  async function onChange(evt) {
    const selectedUser = evt.target.value;
    setUser(selectedUser);

    if (selectedUser) {
      const address = userWallet.getAddress(selectedUser);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Wallets</h1>

      <label>
        Wallet Address
        <select onChange={onChange} value={user}>
          <option value="">Please select an account</option>
          {userWallet.USERS.map((u, i) => (
            <option key={i} value={u}>
              {u}
            </option>
          ))}
        </select>
      </label>

      <div className="address">Address: {userWallet.getAddress(user)}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
