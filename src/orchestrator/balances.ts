import { TokenType } from '../types/config';
import { convertCoinFromUDenom, getConfig } from '../lib/utils';
import {concat, first, from, map, switchMap, take} from 'rxjs';
import {nativeBalanceQuery$, snip20BalanceQuery$} from '../services/balances';
import {QueryAllBalancesResponse} from 'secretjs/dist/grpc_gateway/cosmos/bank/v1beta1/query.pb';
import {Balance, Snip20BalanceResponse} from '../types/balances';

function parseNativeBalance(resp: QueryAllBalancesResponse) {
  const config = getConfig();
  const balances = resp.balances!.reduce((previousArray: Balance[], coin) => {
    const token = config.tokens[coin.denom!];
    if(token === undefined) {
      return previousArray;
    }
    previousArray.push({
      id: coin.denom!,
      amount: convertCoinFromUDenom(coin.amount!, token.decimals),
    });
    return previousArray;
  }, []);
  return balances;
}

function parseSnip20Balance(address: string, resp: Snip20BalanceResponse) {
  const config = getConfig();
  const token = config.tokens[address];
  return {
    id: address,
    amount: convertCoinFromUDenom(resp.balance.amount, token.decimals)
  };
}

function updateBalance$(token: string) {
  const config = getConfig();
  const tokenInfo = config.tokens[token];
  if(tokenInfo === undefined) {
    throw new Error(`${token} is not a token in the config`);
  }
  if(tokenInfo.type === TokenType.NATIVE) {
    return nativeBalanceQuery$(tokenInfo.chainId).pipe(
      map(parseNativeBalance),
      switchMap((balanceArray) => from(balanceArray).pipe(
        take(balanceArray.length),
      ))
    );
  }
  const codeHash = tokenInfo.codeHash!;
  return snip20BalanceQuery$({ address: token, codeHash, }).pipe(
    map((resp: Snip20BalanceResponse) => parseSnip20Balance(token, resp)),
    first()
  );
  
}

function updateBalances$(tokens: string[]) {
  const balanceQueryObservables = tokens.map((nextToken) => updateBalance$(nextToken));
  return concat(...balanceQueryObservables)
}

export {
  updateBalance$,
  updateBalances$,
}
