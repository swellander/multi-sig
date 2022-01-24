import React from 'react';
import { useParams } from 'react-router-dom';
import { useContractLoader } from 'eth-hooks';
import Contract from '../component/Contract';

export default ({ userSigner, contractConfig, localChainId, writeContracts }) => {
  const { address } = useParams();
  const customAddresses = { MultiSigWallet: address };
  const config = { ...contractConfig, customAddresses };
  
  const { MultiSigWallet } = useContractLoader(userSigner, config, localChainId);
  return (
    <>
      <h3>Wallet Interface for {address}</h3>
      <h2>WHERE is ITTT</h2>
      <Contract customContract={MultiSigWallet} />
    </>
  )
}