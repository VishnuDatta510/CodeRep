"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Check,
  RefreshCw,
  Trash2,
  ArrowLeft,
  Chrome,
  LogIn,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      fetchToken();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchToken = async () => {
    try {
      const res = await fetch("/api/user/token");
      const data = await res.json();

      if (data.token) {
        setToken(data.token);
        setExpiresAt(data.expiresAt);
      } else {
        setToken(null);
        setExpiresAt(null);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateToken = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/user/token", {
        method: "POST",
      });
      const data = await res.json();

      if (data.token) {
        setToken(data.token);
        setExpiresAt(data.expiresAt);
      }
    } catch (error) {
      console.error("Error generating token:", error);
    } finally {
      setGenerating(false);
    }
  };

  const revokeToken = async () => {
    try {
      await fetch("/api/user/token", {
        method: "DELETE",
      });
      setToken(null);
      setExpiresAt(null);
    } catch (error) {
      console.error("Error revoking token:", error);
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your API tokens and extension settings
          </p>
        </div>

        {/* Loading State */}
        {!isLoaded && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Not Logged In State */}
        {isLoaded && !user && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Authentication Required
              </h2>
              <p className="text-gray-600 mb-6">
                API tokens can only be generated for logged-in users. Please
                sign in to access extension settings and generate your API
                token.
              </p>
              <SignInButton mode="modal">
                <Button className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In / Sign Up
                </Button>
              </SignInButton>
            </div>
          </div>
        )}

        {/* Logged In State */}
        {isLoaded && user && (
          <>
            {/* Chrome Extension Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Chrome className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Chrome Extension
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm">
                    Add LeetCode problems to CodeRep with one click directly
                    from the problem page.
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">
                      How to install:
                    </h3>
                    <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                      <li>
                        Open{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          chrome://extensions
                        </code>{" "}
                        in Chrome
                      </li>
                      <li>
                        Enable &quot;Developer mode&quot; (top right toggle)
                      </li>
                      <li>
                        Click &quot;Load unpacked&quot; and select the{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          CodeRep-Extension
                        </code>{" "}
                        folder
                      </li>
                      <li>
                        Copy your API token below and paste it in the extension
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* API Token Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                API Token
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Use this token to authenticate the Chrome extension. Keep it
                secret!
              </p>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : token ? (
                <div className="space-y-4">
                  {/* Token Display */}
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={token}
                      readOnly
                      className="font-mono text-sm bg-gray-50"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToken}
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Expiry Info */}
                  {expiresAt && (
                    <p className="text-sm text-gray-500">
                      Expires on {formatDate(expiresAt)}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={generateToken}
                      disabled={generating}
                      className="gap-2"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${generating ? "animate-spin" : ""}`}
                      />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={revokeToken}
                      className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Revoke
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    No API token generated yet. Create one to use the Chrome
                    extension.
                  </p>
                  <Button
                    onClick={generateToken}
                    disabled={generating}
                    className="gap-2"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate API Token"
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Security Note:</strong> Your API token grants full
                access to your CodeRep account. Never share it publicly. If you
                suspect it&apos;s been compromised, revoke it immediately and
                generate a new one.
              </p>
            </div>

            {/* Extension Reconnect Warning */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> If you regenerate or revoke your API
                token, you must disconnect and reconnect in the Chrome extension
                with the new token for changes to take effect.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
