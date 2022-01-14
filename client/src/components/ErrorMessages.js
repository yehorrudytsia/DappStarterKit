import React from "react";

export function NetworkErrorMessage({ message, dismiss }) {
  return (
    <div className="alert alert-danger" role="alert">
      {message}
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={dismiss}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

export function NoTokensMessage({ selectedAddress }) {
  return (
    <>
      <p>You don't have tokens</p>
    </>
  );
}


export function NoWalletDetected() {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-6 p-4 text-center">
          <p>
            No Ethereum wallet was detected. <br />
            Please install{" "}
            <a
              href="http://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export function TransactionErrorMessage({ message, dismiss }) {
    return (
      <div className="alert alert-danger" role="alert">
        Error sending transaction: {message.substring(0, 100)}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={dismiss}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }