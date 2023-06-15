import { createFetchClient } from '.';
import { from, defer, map, first, switchMap } from 'rxjs';
import { getClient } from '../lib/wallet';
import {getConfig} from '../lib/utils';
import {Contract} from '../types/pool';
import {getViewingKeyFromKeplr$} from './keplr';
import {Snip20BalanceResponse} from '../types/balances';

const config = getConfig();
const secretChainId = Object.keys(config.chains).find((nextId) => config.chains[nextId].name === 'Secret')!;

function nativeBalanceQuery$(chainId: string) {
  console.log(getClient(chainId));
  return createFetchClient(defer(() => (
    from(getClient(chainId).query.bank.allBalances({
      address: getClient(chainId).address
  }))
  ))).pipe(
    first()
  );
}

function snip20BalanceQuery$(contract: Contract) {
  return getViewingKeyFromKeplr$(secretChainId, contract.address).pipe(
    switchMap((key) => (
      createFetchClient(defer(() => (
        from(getClient(secretChainId).query.compute.queryContract({
        contract_address: contract.address,
        code_hash: contract.codeHash,
        query: { balance: { address: getClient(secretChainId).address, key, }},
      }))
      ))).pipe(
        map((response) => response as Snip20BalanceResponse),
        first()
      )
    )),
    first()
  );
}

export {
  nativeBalanceQuery$,
  snip20BalanceQuery$
}
