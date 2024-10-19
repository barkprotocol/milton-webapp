'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart"; 
import { Wallet, Sparkles, Bolt, Coins, Image, TrendingUp } from 'lucide-react';
import Notification from "@/components/ui/notification";
import ChartTooltip from '@/components/ui/chart-tooltip';

const activityData = [
  { name: 'Jan', Transactions: 50, Rewards: 25 },
  { name: 'Feb', Transactions: 75, Rewards: 35 },
  { name: 'Mar', Transactions: 100, Rewards: 50 },
  { name: 'Apr', Transactions: 85, Rewards: 40 },
  { name: 'May', Transactions: 120, Rewards: 60 },
  { name: 'Jun', Transactions: 90, Rewards: 45 },
];

export default function DashboardPage() {
  const [userBalance, setUserBalance] = useState<number>(0);
  const [stakingAPY, setStakingAPY] = useState<number>(0);
  const [dailyReward, setDailyReward] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/user/data'); // Adjust API endpoint
        const data = await response.json();
        if (response.ok) {
          setUserBalance(data.balance);
          setStakingAPY(data.apy);
          setDailyReward(calculateRewards(data.balance, data.apy));
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const calculateRewards = (balance: number, apy: number) => {
    const dailyRate = apy / 365;
    return (balance * dailyRate / 100).toFixed(2);
  };

  const claimRewards = async () => {
    setLoading(true); // Start loading when claiming rewards
    try {
      const response = await fetch('/api/user/claim-rewards', { method: 'POST' }); // Adjust API endpoint
      const data = await response.json();
      if (response.ok) {
        setNotification('Rewards claimed successfully!');
        await fetchUserData(); // Re-fetch to update balance
      } else {
        throw new Error(data.message || 'Failed to claim rewards');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Stop loading after operation
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Milton Dashboard</h1>
        <Button variant="outline" onClick={claimRewards} disabled={loading}>
          <Sparkles className="mr-2 h-4 w-4 text-yellow-500" /> Claim Daily Reward
        </Button>
      </header>

      {loading && <div className="text-center">Loading...</div>}
      {error && <Notification message={error} type="error" />}
      {notification && <Notification message={notification} type="success" />}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBalance.toFixed(2)} MILTON</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="text-yellow-500 mr-1 h-4 w-4" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
            <Coins className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,324.62 MILTON</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="text-yellow-500 mr-1 h-4 w-4" />
              +10.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NFTs Owned</CardTitle>
            <Image className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 new this month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-muted/10 to-muted/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staking APY</CardTitle>
            <Bolt className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stakingAPY.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Daily: {dailyReward} MILTON</p>
          </CardContent>
        </Card>
      </div>

      <ChartContainer>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="Transactions" fill="#ff7300" />
            <Bar dataKey="Rewards" fill="#387908" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display recent transactions here */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rewards History</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display rewards history here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
