'use client';

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Zap, RefreshCcw, CreditCard, Heart, Coins, Vote, Gift, Repeat } from 'lucide-react';
import { API } from './endpoint'; 

type ApiResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

type ApiEndpoint = {
  name: string;
  icon: React.ReactNode;
  description: string;
  fields: { name: string; type: string; placeholder: string; required: boolean; options?: string[] }[];
};

const currencyIcons = {
  USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  SOL: 'https://cryptologos.cc/logos/solana-sol-logo.png',
  MILTON: 'https://cryptologos.cc/logos/milton-logo.png',
  BARK: 'https://cryptologos.cc/logos/bark-logo.png',
};

const Spinner = () => (
  <div className="h-5 w-5 border-4 border-t-transparent border-yellow-500 rounded-full animate-spin" />
);

export default function ApiDemo() {
  const [activeTab, setActiveTab] = useState('blinks');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const apiEndpoints: Record<string, ApiEndpoint> = useMemo(() => ({
    blinks: {
      name: 'Blinks',
      icon: <Zap className="w-4 h-4 text-yellow-500" />,
      description: 'Create and retrieve instant messages on the blockchain',
      fields: [
        { name: 'text', type: 'text', placeholder: 'Blink text', required: true },
        { name: 'userId', type: 'text', placeholder: 'User ID', required: true },
        { name: 'tags', type: 'text', placeholder: 'Tags (comma-separated)', required: false },
      ],
    },
    transactions: {
      name: 'Transactions',
      icon: <RefreshCcw className="w-4 h-4 text-yellow-500" />,
      description: 'Manage blockchain transactions',
      fields: [
        { name: 'fromAddress', type: 'text', placeholder: 'From Address', required: true },
        { name: 'toAddress', type: 'text', placeholder: 'To Address', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'currency', type: 'select', placeholder: 'Currency', required: true, options: ['USDC', 'SOL', 'MILTON', 'BARK'] },
        { name: 'memo', type: 'text', placeholder: 'Memo', required: false },
      ],
    },
    payments: {
      name: 'Payments',
      icon: <CreditCard className="w-4 h-4 text-yellow-500" />,
      description: 'Process payments on the Milton platform',
      fields: [
        { name: 'userId', type: 'text', placeholder: 'User ID', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'currency', type: 'select', placeholder: 'Currency', required: true, options: ['USDC', 'SOL', 'MILTON', 'BARK'] },
        { name: 'description', type: 'text', placeholder: 'Payment Description', required: false },
      ],
    },
    donations: {
      name: 'Donations',
      icon: <Heart className="w-4 h-4 text-yellow-500" />,
      description: 'Manage charitable donations',
      fields: [
        { name: 'donorId', type: 'text', placeholder: 'Donor ID', required: true },
        { name: 'recipientId', type: 'text', placeholder: 'Recipient ID', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'currency', type: 'select', placeholder: 'Currency', required: true, options: ['USDC', 'SOL', 'MILTON', 'BARK'] },
        { name: 'message', type: 'textarea', placeholder: 'Message (optional)', required: false },
        { name: 'anonymous', type: 'checkbox', placeholder: 'Anonymous Donation', required: false },
      ],
    },
    send: {
      name: 'Send',
      icon: <Coins className="w-4 h-4 text-yellow-500" />,
      description: 'Send USDC, SOL, MILTON, or SPL tokens',
      fields: [
        { name: 'fromAddress', type: 'text', placeholder: 'From Address', required: true },
        { name: 'toAddress', type: 'text', placeholder: 'To Address', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'currency', type: 'select', placeholder: 'Currency', required: true, options: ['USDC', 'SOL', 'MILTON', 'BARK'] },
        { name: 'tokenAddress', type: 'text', placeholder: 'Token Address (for SPL tokens)', required: false },
        { name: 'memo', type: 'text', placeholder: 'Memo', required: false },
      ],
    },
    governance: {
      name: 'Governance',
      icon: <Vote className="w-4 h-4 text-yellow-500" />,
      description: 'Participate in decentralized decision-making',
      fields: [
        { name: 'action', type: 'select', placeholder: 'Action', required: true, options: ['propose', 'vote', 'execute'] },
        { name: 'title', type: 'text', placeholder: 'Proposal Title', required: true },
        { name: 'description', type: 'textarea', placeholder: 'Proposal Description', required: true },
        { name: 'proposerId', type: 'text', placeholder: 'Proposer ID', required: true },
        { name: 'options', type: 'text', placeholder: 'Options (comma-separated)', required: true },
        { name: 'proposalId', type: 'text', placeholder: 'Proposal ID (for voting/executing)', required: false },
        { name: 'voterId', type: 'text', placeholder: 'Voter ID', required: false },
        { name: 'optionIndex', type: 'number', placeholder: 'Option Index', required: false },
        { name: 'executorId', type: 'text', placeholder: 'Executor ID (for executing)', required: false },
      ],
    },
    gift: {
      name: 'Gift',
      icon: <Gift className="w-4 h-4 text-yellow-500" />,
      description: 'Send and receive gifts on the Milton platform',
      fields: [
        { name: 'senderId', type: 'text', placeholder: 'Sender ID', required: true },
        { name: 'recipientId', type: 'text', placeholder: 'Recipient ID', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'currency', type: 'select', placeholder: 'Currency', required: true, options: ['USDC', 'SOL', 'MILTON', 'BARK'] },
        { name: 'message', type: 'textarea', placeholder: 'Gift Message', required: false },
        { name: 'scheduleDate', type: 'date', placeholder: 'Schedule Date', required: false },
      ],
    },
    swap: {
      name: 'Swap',
      icon: <Repeat className="w-4 h-4 text-yellow-500" />,
      description: 'Swap tokens using Jupiter API',
      fields: [
        { name: 'fromAddress', type: 'text', placeholder: 'From Address', required: true },
        { name: 'toAddress', type: 'text', placeholder: 'To Address', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'currencyFrom', type: 'select', placeholder: 'From Currency', required: true, options: ['USDC', 'SOL', 'MILTON', 'BARK'] },
        { name: 'currencyTo', type: 'select', placeholder: 'To Currency', required: true, options: ['USDC', 'SOL', 'MILTON', 'BARK'] },
        { name: 'slippage', type: 'number', placeholder: 'Slippage (%)', required: false },
        { name: 'routeId', type: 'text', placeholder: 'Route ID (optional)', required: false },
      ],
    },
  }), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null); // Reset response state on new submission

    try {
      // Example of a real API call using fetch
      const res = await fetch(API.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResponse({
        success: true,
        data: { message: "Success! Your request has been processed." },
      });
    } catch (error: any) {
      console.error("API Error:", error);
      setResponse({
        success: false,
        data: null,
        error: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
      setFormData({}); // Clear the form after submission
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Demo</CardTitle>
        <CardDescription>Test various API endpoints.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {Object.entries(apiEndpoints).map(([key, endpoint]) => (
              <TabsTrigger key={key} value={key}>
                {endpoint.icon} {endpoint.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(apiEndpoints).map(([key, endpoint]) => (
            <TabsContent key={key} value={key}>
              <h3 className="font-medium">{endpoint.description}</h3>
              <form onSubmit={handleSubmit} className="mt-4">
                {endpoint.fields.map((field) => (
                  <div key={field.name} className="mb-4">
                    <Label htmlFor={field.name}>{field.placeholder}</Label>
                    {field.type === 'select' ? (
                      <select
                        name={field.name}
                        required={field.required}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option value="" disabled>Select {field.placeholder}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <Textarea
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    ) : (
                      <Input
                        type={field.type}
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    )}
                  </div>
                ))}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Spinner /> : 'Submit'}
                </Button>
              </form>
              {response && (
                <div className={`mt-4 ${response.success ? 'text-green-600' : 'text-red-600'}`}>
                  {response.success ? (
                    <Alert>
                      <AlertTitle>Success!</AlertTitle>
                      <AlertDescription>{response.data?.message}</AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                      <AlertTitle>Error!</AlertTitle>
                      <AlertDescription>{response.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
