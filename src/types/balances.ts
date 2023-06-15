type Snip20BalanceResponse = {
  balance: {
    amount: string
  }
}

type Balance = {
  id: string,
  amount: string,
}

type Balances = {
  [id: string]: Balance,
}

export {
  Snip20BalanceResponse,
  Balance,
  Balances,
}
