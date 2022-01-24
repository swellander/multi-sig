import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Chip } from '@mui/material';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Address from '../components/Address';
import { useHistory } from 'react-router-dom';


function Home({ readContracts, writeContracts }) {
  const history = useHistory();
  const { MultiSigWalletFactory } = readContracts;
  const [wallets, setWallets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [newOwner, setNewOwner] = useState('');
  const [numConfirmations, setNumConfirmations] = useState(0);

  const handleAddOwner = () => {
    setOwners([...owners, newOwner]);
    setNewOwner('');
  }
  const handleCreateContract = async () => {
    const txData = await writeContracts.MultiSigWalletFactory.create(owners, numConfirmations);
    console.log({txData})
  }
  const handleClickWallet = walletAddress => history.push('/wallet/' + walletAddress);

  useEffect(async () => {
    const existingWallets = await readContracts.MultiSigWalletFactory?.getWallets();
    setWallets(existingWallets || []);
  }, [MultiSigWalletFactory]);

  return (
    <Grid container>
      <Grid xs={6} container>
        <h3>Existing Wallets</h3>
        {wallets.map(wallet => (
          <Grid xs={12}>
            <Chip
              // icon={<AccountBalanceWalletIcon/>}
              label={wallet}
              onClick={() => handleClickWallet(wallet)}
            />
          </Grid>
        ))}
      </Grid>
      <Grid xs={6}>
        <h3>Create Multi-Sig Wallet</h3>
        <Grid>
        <TextField
          type="number"
          value={numConfirmations}
          onChange={e => setNumConfirmations(e.target.value)}
        />
        </Grid>
        <Grid>
        <TextField
          value={newOwner}
          onChange={e => setNewOwner(e.target.value)}
        />
        <Button
          onClick={handleAddOwner}
        >Add Owner</Button>
        </Grid>
        <Button onClick={handleCreateContract}>Create Contract</Button>
      </Grid>
      <h3>Owners</h3>
      {owners.map(owner => <Address address={owner}/>)}
    </Grid>
  );
}

export default Home;
