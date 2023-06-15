import { createFetchClient } from '.';
import { from, defer, map, first } from 'rxjs';
import { getClient } from '../lib/wallet';
import {RoundQueryResponse, ConfigQueryResponse, StateQueryResponse} from '../types/pool';
import {MsgExecuteContract} from 'secretjs';
import {getConfig} from '../lib/utils';

const config = getConfig();

const secretChainId = Object.keys(config.chains).find((nextId) => config.chains[nextId].name === 'Secret');

function queryRound$({
  address,
  codeHash,
}:{
  address: string,
  codeHash: string,
}) {
  return createFetchClient(defer(() => (
    from(getClient(secretChainId ?? '').query.compute.queryContract({
    contract_address: address,
    code_hash: codeHash,
    query: { round: {} },
  }))
  ))).pipe(
    map((response) => response as RoundQueryResponse),
    first()
  );
}

function queryConfig$({
  address,
  codeHash,
}:{
  address: string,
  codeHash: string,
}) {
  return createFetchClient(defer(() => (
    from(getClient(secretChainId ?? '').query.compute.queryContract({
    contract_address: address,
    code_hash: codeHash,
    query: { contract_config: {} },
  }))
  ))).pipe(
    map((response) => response as ConfigQueryResponse),
    first()
  );
}

function queryState$({
  address,
  codeHash,
}:{
  address: string,
  codeHash: string,
}) {
  return createFetchClient(defer(() => (
    from(getClient(secretChainId ?? '').query.compute.queryContract({
    contract_address: address,
    code_hash: codeHash,
    query: { pool_state: {} },
  }))
  ))).pipe(
    map((response) => response as StateQueryResponse),
    first()
  );
}

function sendDepositTx$({
  contractAddress,
  codeHash,
  denomOrAddr,
  amountUDenom
}:{
  contractAddress: string,
  codeHash: string
  denomOrAddr: string,
  amountUDenom: string,
}) {
  const client = getClient(secretChainId ?? '');
  const msgs = new MsgExecuteContract({
    sender: client.address,
    contract_address: contractAddress,
    code_hash: codeHash,
    msg: { deposit: {} },
    sent_funds: [{
      amount: amountUDenom,
      denom: denomOrAddr,
    }]
  });
  return createFetchClient(defer(() => (
    from(client.tx.broadcast([msgs]))
  ))).pipe(
    first(),
  );
}

export {
  queryRound$,
  queryConfig$,
  queryState$,
  sendDepositTx$,
};
