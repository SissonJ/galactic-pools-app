enum TokenType {
  NATIVE = 'native',
  SNIP20 = 'snip20',
};

type Config = {
  poolContracts: {
    address: string,
    codeHash: string,
    chainId: string,
  } [],
  chains: {
    [chainId: string]: {
      name: string,
      url: string,
    }
  }
  tokens: {
    [denomOrAddresss: string]: {
      name: string,
      logoPath: string,
      addr: string,
      codeHash?: string,
      chainId: string,
      type: TokenType,
      decimals: number,
    }
  }
}

export {
  Config,
  TokenType,
};
