import { forkJoin, map, first, concat, take } from 'rxjs';
import { queryConfig$, queryRound$, queryState$ } from '../services/pool';
import {Contract, PoolOrchestratorRawResponse, PoolOrchestratorResponse} from '../types/pool';
import {getConfig} from '../lib/utils';

const config = getConfig();

// parse the response from the array of query objects to something that should be placed in the store
function parsePoolsResponse(response: PoolOrchestratorRawResponse): PoolOrchestratorResponse {
  console.log(response);
  let remaining = (response[0].end_time - new Date().getUTCMilliseconds()).toString();
  if(Number(remaining) < 0) {
    remaining = '0';
  }
  let addrOrDenom;
  if('denom' in response[1]) {
    addrOrDenom = response[1].denom ?? '';
  } else {
    addrOrDenom = response[1].contractAddress ?? ''; // need to add code hash too
  }
  return {
    poolContract: config.poolContracts.find((nextContract) => nextContract.address === response[1].contract_address) ?? {
      address: '',
      codeHash: '',
    },
    remainingCountdownMS: remaining,
    poolRoundNumber: response[0].current_round_index.toString(),
    unbondingTime: response[1].unbonding_duration.toString(),
    prize: '123456', // Not sure how to calculate this
    token: {
      addrOrDenom,
    }
  };
}

// combine multiple queries into one query operation
// returns with one object in array form
function updatePool$(contractAddress: string, codeHash: string) {
  return forkJoin([
    queryRound$({address: contractAddress, codeHash}),
    queryConfig$({address: contractAddress, codeHash}),
    queryState$({address: contractAddress, codeHash})
  ]).pipe(
    map(parsePoolsResponse),
    first(),
  );
}

// combine multiple contract queries into one call
// will emit the values one at a time and each return will trigger the 'next' funciton in the store
function updatePools$(contracts: Contract[]) {
  const poolQueryObservables = contracts.map((contract) => updatePool$(contract.address, contract.codeHash));
  return concat(...poolQueryObservables).pipe(
    take(poolQueryObservables.length)
  );
}

export {
  updatePool$,
  updatePools$,
}
