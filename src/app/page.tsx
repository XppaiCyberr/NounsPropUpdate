"use client";

import { useEffect, useState } from "react";
import { NounsProposal } from "../types/nouns";
import ProposalCard from "../components/ProposalCard";
import NewsletterSubscription from "../components/NewsletterSubscription";

export default function Home() {
  const [proposals, setProposals] = useState<NounsProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch proposals from Nouns API with concurrent fetching
  useEffect(() => {
    async function fetchProposals() {
      try {
        setLoading(true);
        setError(null);
        
        // Create concurrent fetch promises with improved error handling
        const proposalIds = Array.from({ length: 5 }, (_, i) => 810 - i); // [810, 809, 808, ..., 800]
        
        const fetchProposal = async (id: number) => {
          try {
            const response = await fetch(`https://api.nouns.biz/proposal/${id}`, {
              // Add timeout and other fetch options for better reliability
              signal: AbortSignal.timeout(10000), // 10 second timeout
            });
            
            if (!response.ok) {
              console.warn(`Failed to fetch proposal ${id}: ${response.status}`);
              return null;
            }
            
            return await response.json();
          } catch (error) {
            console.warn(`Error fetching proposal ${id}:`, error);
            return null;
          }
        };

        // Execute all fetches concurrently with Promise.allSettled for better error resilience
        const results = await Promise.allSettled(
          proposalIds.map(id => fetchProposal(id))
        );
        
        // Extract successful results and filter out nulls
        const validProposals = results
          .filter((result): result is PromiseFulfilledResult<any> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);
        
        if (validProposals.length === 0) {
          setError("No proposals could be loaded. Please check your connection and try again.");
        } else {
          setProposals(validProposals);
          
          // Log any failed fetches for debugging
          const failedCount = results.length - validProposals.length;
          if (failedCount > 0) {
            console.info(`Successfully loaded ${validProposals.length} proposals, ${failedCount} failed to load`);
          }
        }
        
      } catch (err) {
        setError("Failed to fetch proposals. Please try again later.");
        console.error("Error fetching proposals:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Nouns proposals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Proposals</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🏛️ Nouns Proposals
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the latest governance proposals from Nouns DAO. 
              Stay informed about community decisions and participate in decentralized governance.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Newsletter Subscription */}
        <div className="mb-8">
          <NewsletterSubscription />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{proposals.length}</div>
              <div className="text-sm text-gray-600">Recent Proposals</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {proposals.filter(p => p.status.currentStatus === 'Executed').length}
              </div>
              <div className="text-sm text-gray-600">Executed</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {proposals.reduce((sum, p) => sum + p.votes.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Voters</div>
            </div>
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Latest Proposals</h2>
            <div className="text-sm text-gray-500">
              Showing {proposals.length} proposals
            </div>
          </div>

          {proposals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {proposals.map((proposal) => (
                <ProposalCard key={proposal.proposalId} proposal={proposal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No proposals found</h3>
              <p className="text-gray-600">Please check back later for new proposals.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500">
            <p className="mb-2">
              Data provided by{" "}
              <a 
                href="https://api.nouns.biz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Nouns API
              </a>
            </p>
            <p className="text-sm">
              Built with ❤️ for the Nouns community • 
              Powered by smart wallet profiles for secure newsletter subscriptions
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}