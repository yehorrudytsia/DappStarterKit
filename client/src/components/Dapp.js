import React from "react";

import { ethers } from "ethers";
import TokenArtifact from "../contracts/Token.json";
import contractAddress from "../contracts/contractAddress.json";
import { NoWalletDetected, TransactionErrorMessage, NoTokensMessage } from "./ErrorMessages";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Transfer } from "./Transfer";
import { WaitingTx } from "./WaitingTx";


const ERROR_CODE_TX_REJECTED_BY_USER = 4001;


export default class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tokenData: undefined,
      selectedAddress: undefined,
      balance: undefined,
      txBeingSent: undefined,
      transactionError: undefined,
    };
  }

  render() {
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    if (!this.state.selectedAddress) {
      return <ConnectWallet connectWallet={() => this._connectWallet()} />;
    }

    if (!this.state.tokenData || !this.state.balance) {
      return <Loading />;
    }

    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <h1>
              {this.state.tokenData.name} 
              ({this.state.tokenData.symbol}) 
            </h1>
            <h1>
              Amount of locked tokens: {this.state.tokenData.valueLocked.toString()} 
            </h1>
            <p>
              Your address is <b>{this.state.selectedAddress}</b>, you have{" "}
              <b>
                {this.state.balance.toString()} {this.state.tokenData.symbol}
              </b>
            </p>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            {}

            {this.state.txBeingSent && (
              <WaitingTx txHash={this.state.txBeingSent} />
            )}

            {}

            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {}

            {this.state.balance.eq(0) && (
              <NoTokensMessage selectedAddress={this.state.selectedAddress} />
            )}

            {}

            {this.state.balance.gt(0) && (
              <Transfer
                transferTokens={(to, amount) =>
                  this._transferTokens(to, amount)
                }
                tokenSymbol={this.state.tokenData.symbol}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this._stopPollingData();
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and intializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.enable();

    this._initialize(selectedAddress);

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      this._initialize(newAddress);
    });
  }

  _initialize(userAddress) {
    this.setState({
      selectedAddress: userAddress,
    });



    this._intializeEthers();
    this._getTokenData();
    this._startPollingData();
  }

  async _intializeEthers() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
  }


  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);
    this._updateBalance();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  async _getTokenData() {
    const name = await this._token.name();
    const symbol = await this._token.symbol();
    const valueLocked = await this._token.valueLocked();
    console.log(valueLocked.toString());
    this.setState({ tokenData: { name, symbol, valueLocked } });
  }

  async _updateBalance() {
    const balance = await this._token.getBalance(this.state.selectedAddress);
    this.setState({ balance });
  }

  async _transferTokens(to, amount) {

    try {
      this._dismissTransactionError();
      const tx = await this._token.transfer(to, amount);
      this.setState({ txBeingSent: tx.hash });

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      await this._updateBalance();
    } catch (error) {

      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }


      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }
}