import { NounsProposal } from '../types/nouns';

interface ProposalCardProps {
  proposal: NounsProposal;
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  // Calculate vote totals
  const forVotes = proposal.votes.filter(v => v.support === 'FOR').reduce((sum, v) => sum + v.votes, 0);
  const againstVotes = proposal.votes.filter(v => v.support === 'AGAINST').reduce((sum, v) => sum + v.votes, 0);
  const abstainVotes = proposal.votes.filter(v => v.support === 'ABSTAIN').reduce((sum, v) => sum + v.votes, 0);
  const totalVotes = forVotes + againstVotes + abstainVotes;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'executed': return 'bg-green-100 text-green-800';
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'defeated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500">Proposal #{proposal.proposalId}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status.currentStatus)}`}>
              {proposal.status.currentStatus}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{proposal.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">{proposal.description}</p>
        </div>
      </div>

      {/* Proposer */}
      <div className="mb-4">
        <span className="text-sm text-gray-500">Proposed by: </span>
        <span className="text-sm font-mono text-gray-700">{formatAddress(proposal.proposer)}</span>
      </div>

      {/* Voting Results */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Voting Results</span>
          <span className="text-sm text-gray-500">{totalVotes} total votes</span>
        </div>
        
        {/* Vote bars */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-green-600 w-16">FOR ({forVotes})</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: totalVotes > 0 ? `${(forVotes / totalVotes) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-red-600 w-16">AGAINST ({againstVotes})</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: totalVotes > 0 ? `${(againstVotes / totalVotes) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 w-16">ABSTAIN ({abstainVotes})</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                style={{ width: totalVotes > 0 ? `${(abstainVotes / totalVotes) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quorum Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Quorum Progress</span>
          <span className="text-xs text-gray-500">
            {totalVotes}/{proposal.quorumVotes} votes needed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              totalVotes >= proposal.quorumVotes ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min((totalVotes / proposal.quorumVotes) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        <span>Block Range: {proposal.startBlock} - {proposal.endBlock}</span>
        <span>{proposal.votes.length} voters</span>
      </div>
    </div>
  );
} 