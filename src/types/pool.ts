import BigNumber from "bignumber.js"

type Pool = { // For the table
  stakingPool: string, // token contract addr
  prizeAmount: string, // number
  remainingCountdownMS: string, // Probably in MS
  deposit: string, // pool contract addr
  subRows: {},
}

type Contract = {
  address: string,
  codeHash: string,
}

type PoolOrchestratorResponse = {
  poolContract: Contract,
  remainingCountdownMS: string, // time remaining in countdown
  poolRoundNumber: string,
  unbondingTime: string,
  prize: string,
  token: {
    addrOrDenom: string, // Denom or contract address
    codeHash?: string,
  }
}


type PoolStore = { // For pinia
  [contractAddress: string]: PoolOrchestratorResponse
}

type UserPoolStore = { // For pinia user data
  [userAddr: string]: {
    amountDelegated: BigNumber,
    amountUnbonding: BigNumber,
    totalWon: BigNumber,
  }
}

type RoundQueryResponse = {
  current_round_index: number,
  end_time: number,
}

type ConfigQueryResponse = {
  contract_address: string,
  unbonding_duration: number,
  denom?: string, // denom
  contractAddress?: string, // token contract address (for L2)
}

type StateQueryResponse = {
  rewards_returned_to_contract: string,
  total_delegated: string,
  total_reserves: string,
  total_sponsored: string,
}

type PoolOrchestratorRawResponse = [RoundQueryResponse, ConfigQueryResponse, StateQueryResponse];

export {
  Pool,
  Contract,
  PoolStore,
  UserPoolStore,
  RoundQueryResponse,
  ConfigQueryResponse,
  StateQueryResponse,
  PoolOrchestratorRawResponse,
  PoolOrchestratorResponse,
};
