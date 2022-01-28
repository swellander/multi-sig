import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Address from "../components/Address";
import { Grid, TextField, Button, Chip } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useHistory } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const PadGrid = styled(Grid)`
  padding: 20px;
`;

const FormItem = styled(Grid)`
  margin: 10px;
`;

const AddressChip = styled(Chip)`
  .MuiChip-label {
    font-size: 16px;
  }
`;

function Home({ readContracts, writeContracts }) {
  const history = useHistory();
  const { MultiSigWalletFactory } = readContracts;
  const [wallets, setWallets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [newOwner, setNewOwner] = useState("");
  const [numConfirmations, setNumConfirmations] = useState();

  const createBtnIsDisabled = !numConfirmations || !owners.length;

  const handleAddOwner = () => {
    setOwners([...owners, newOwner]);
    setNewOwner("");
  };
  const handleCreateContract = async () => {
    const txData = await writeContracts.MultiSigWalletFactory.create(owners, numConfirmations);
    console.log({ txData });
  };
  const handleClickWallet = walletAddress => history.push("/wallet/" + walletAddress);

  useEffect(async () => {
    const existingWallets = await readContracts.MultiSigWalletFactory?.getWallets();
    setWallets(existingWallets || []);
  }, [MultiSigWalletFactory]);

  return (
    <PadGrid container justifyContent="space-around">
      <PadGrid xs={7} container>
        <PadGrid xs={12} container justifyContent="flex-start" >
          <h3>Create New Multi-Sig Wallet</h3>
        </PadGrid>
        <FormItem xs={12} container justifyContent="flex-start">
          <Grid container xs={11}>
            <TextField fullWidth label="Contract Owner" value={newOwner} onChange={e => setNewOwner(e.target.value)} />
          </Grid>
          <Grid xs={1}>
            <IconButton onClick={handleAddOwner}>
              <AddCircleIcon fontSize="large" />
            </IconButton>
          </Grid>
        </FormItem>
        <Grid xs={4}>
          <FormItem xs={12} container justifyContent="flex-start">
            <TextField
              label="Confirmations"
              type="number"
              value={numConfirmations}
              onChange={e => setNumConfirmations(e.target.value)}
            />
          </FormItem>
          <FormItem xs={12} container justifyContent="flex-start">
            <Button variant="contained" onClick={handleCreateContract} disabled={createBtnIsDisabled}>
              Create Contract
            </Button>
          </FormItem>
        </Grid>
        <Grid xs={7} style={{ overflow: "scroll", margin: 10, height: '40vh'}}>
          {owners.map(owner => (
            <Grid xs={12} container justifyContent="flex-start" style={{marginBottom: 10}}>
              <Address fontSize={16} address={owner} size="long" />
            </Grid>
          ))}
        </Grid>
      </PadGrid>

      <PadGrid xs={4}>
        <PadGrid xs={12} container justifyContent="flex-start">
          <h3>Existing Multi Sig Wallets</h3>
        </PadGrid>
        <Grid>
          {wallets.map(wallet => (
            <PadGrid xs={12} container justifyContent="flex-start" style={{ padding: 5 }}>
              <AddressChip
                fontSize={16}
                icon={<AccountBalanceWalletIcon />}
                label={wallet}
                onClick={() => handleClickWallet(wallet)}
              />
            </PadGrid>
          ))}
        </Grid>
      </PadGrid>
    </PadGrid>
  );
}

export default Home;
