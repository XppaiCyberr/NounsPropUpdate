"use client";

import { useState, useEffect } from "react";
import { encodeFunctionData, erc20Abi, parseUnits } from "viem";
import { useSendCalls, useConnect } from "wagmi";

interface SubscriptionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export default function NewsletterSubscription() {
  const [result, setResult] = useState<SubscriptionResult | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { sendCalls, data, error, isPending } = useSendCalls();
  const { connect, connectors } = useConnect();

  // Function to get callback URL from environment variable
  function getCallbackURL() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
    
    if (!baseUrl) {
      console.warn("NEXT_PUBLIC_APP_URL not set, falling back to default");
      return "https://nounsupdate.vercel.app/api/data-validation";
    }
    
    // Ensure URL has protocol
    const url = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
    return `${url}/api/data-validation`;
  }

  // Handle response data when sendCalls completes
  useEffect(() => {
    if (data?.capabilities?.dataCallback && isSubscribing) {
      const callbackData = data.capabilities.dataCallback;
      
      if (callbackData.email) {
        // Send email to newsletter API
        fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: callbackData.email }),
        })
        .then(response => response.json())
        .then(newsletterResult => {
          if (newsletterResult.success) {
            setResult({ 
              success: true, 
              message: `🎉 Successfully subscribed ${callbackData.email} to the newsletter! Check your email for confirmation.` 
            });
          } else {
            setResult({ 
              success: false, 
              error: newsletterResult.error || "Failed to send newsletter confirmation" 
            });
          }
        })
        .catch(err => {
          setResult({ 
            success: false, 
            error: "Failed to process newsletter subscription" 
          });
        })
        .finally(() => {
          setIsSubscribing(false);
        });
      } else {
        setResult({ success: false, error: "No email provided" });
        setIsSubscribing(false);
      }
    } else if (data && !data.capabilities?.dataCallback && isSubscribing) {
      setResult({ success: false, error: "Invalid response - no email data received" });
      setIsSubscribing(false);
    }
  }, [data, isSubscribing]);

  // Handle errors
  useEffect(() => {
    if (error && isSubscribing) {
      setResult({ 
        success: false, 
        error: error.message || "Transaction failed" 
      });
      setIsSubscribing(false);
    }
  }, [error, isSubscribing]);

  // Handle newsletter subscription
  async function handleSubscribe() {
    try {
      setResult(null);
      setIsSubscribing(true);

      // Send calls using wagmi hook to get email from smart wallet profile
      sendCalls({
        connector: connectors[0],
        account: null,
        calls: [
          {
            to: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC contract address on Base Sepolia
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "transfer",
              args: [
                "0xE11018C82D4405bDBc7414eC988Fd08351666666",
                parseUnits("0.001", 6), // Small amount for newsletter subscription
              ],
            }),
          },
        ],
        chainId: 84532, // Base Sepolia
        capabilities: {
          dataCallback: {
            requests: [{ type: "email", optional: false }],
            callbackURL: getCallbackURL(),
          },
        },
      });
    } catch (err) {
      setResult({ 
        success: false, 
        error: err instanceof Error ? err.message : "Unknown error occurred" 
      });
      setIsSubscribing(false);
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          📧 Subscribe to Nouns Proposals Newsletter
        </h3>
        <p className="text-sm text-gray-600">
          Stay updated with the latest proposals, voting results, and governance discussions.
          We'll use your smart wallet profile email to send you updates.
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={handleSubscribe}
          disabled={isPending || isSubscribing}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
        >
          {isPending || isSubscribing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Subscribing...
            </>
          ) : (
            <>
              <span>📬</span>
              Subscribe Now
            </>
          )}
        </button>
      </div>

      {/* Results Display */}
      {result && (
        <div className={`mt-4 p-4 rounded-lg ${
          result.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {result.success ? (
            <div className="text-green-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">✅</span>
                <span className="font-medium">Success!</span>
              </div>
              <p className="text-sm">{result.message}</p>
            </div>
          ) : (
            <div className="text-red-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">❌</span>
                <span className="font-medium">Error</span>
              </div>
              <p className="text-sm">{result.error}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>
          🔒 Your email is secure and will only be used for Nouns proposal updates.
          <br />
          Small transaction fee (0.001 USDC) required to verify your smart wallet.
        </p>
      </div>
    </div>
  );
}
