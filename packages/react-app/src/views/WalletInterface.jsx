import React from "react";
import { useParams } from "react-router-dom";
import { useContractLoader } from "eth-hooks";
import Contract from "../components/Contract";

export default ({ userSigner, contractConfig, localChainId, localProvider, gasPrice }) => {
  const { address } = useParams();
  const customAddresses = { MultiSigWallet: address };
  const config = { ...contractConfig, customAddresses };

  const { MultiSigWallet } = useContractLoader(userSigner, config, localChainId);
  return <Contract signer={userSigner} customContract={MultiSigWallet} provider={localProvider} gasPrice={gasPrice} />;
};
