export interface Vote {
  votes: number;
  reason: string;
  voter: string;
  blockNumber: string;
  support: "FOR" | "AGAINST" | "ABSTAIN";
}

export interface Feedback {
  reason: string;
  feedbacker: string;
  blockNumber: string;
  support: "FOR" | "AGAINST" | "ABSTAIN";
}

export interface StatusEvent {
  eventName: string;
  blockNumber: string;
  executableAfterTimestamp?: string;
}

export interface ProposalStatus {
  wasCreatedOnTimelock: boolean;
  hadObjectionPeriod: boolean;
  previousStatuses: StatusEvent[];
  wasUpdated: boolean;
  updateMessages: string[];
  currentStatus: string;
}

export interface ProposalTransactions {
  targets: string[];
  values: string[];
  signatures: string[];
  calldatas: string[];
}

export interface NounsProposal {
  title: string;
  startBlock: string;
  endBlock: string;
  proposalId: number;
  proposer: string;
  transactions: ProposalTransactions;
  signers: string[];
  updatePeriodEndBlock: string;
  proposalThreshold: number;
  quorumVotes: number;
  clientId: number;
  votes: Vote[];
  feedback: Feedback[];
  status: ProposalStatus;
  fork: {
    blamedIn: string[];
  };
  description: string;
  calculatedOutflow: {
    combinedValue: {
      eth: number;
      usd: number;
    };
    tokensERC20: any[];
  };
  annotation: {
    team: string;
    category: string;
    notes: string;
  };
} 