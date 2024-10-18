import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

type TransactionType = 'payment' | 'gift' | 'nft' | 'donation' | 'transaction' | 'memo' | 'crowdfunding' | 'subscription'

interface BaseTransaction {
  type: TransactionType;
  name: string;
}

interface AmountTransaction extends BaseTransaction {
  amount: string;
  currency: string;
}

interface PaymentTransaction extends AmountTransaction {
  type: 'payment';
  recipient: string;
  memo: string;
  paymentMethod: string;
}

interface GiftTransaction extends AmountTransaction {
  type: 'gift';
  recipient: string;
  message: string;
}

interface NFTTransaction extends BaseTransaction {
  type: 'nft';
  description: string;
  image: File | null;
  attributes: never[];
}

interface DonationTransaction extends AmountTransaction {
  type: 'donation';
  cause: string;
  anonymous: boolean;
}

interface GeneralTransaction extends AmountTransaction {
  type: 'transaction';
  recipient: string;
  schedule: string;
}

interface MemoTransaction extends BaseTransaction {
  type: 'memo';
  content: string;
  tags: string[];
}

interface CrowdfundingTransaction extends AmountTransaction {
  type: 'crowdfunding';
  description: string;
  category: string;
  endDate: string;
}

interface SubscriptionTransaction extends AmountTransaction {
  type: 'subscription';
  recipient: string;
  frequency: string;
  duration: number;
}

type Transaction = 
  | PaymentTransaction
  | GiftTransaction
  | NFTTransaction
  | DonationTransaction
  | GeneralTransaction
  | MemoTransaction
  | CrowdfundingTransaction
  | SubscriptionTransaction

export default function TransactionForm() {
  const [transactionType, setTransactionType] = useState<TransactionType>('payment')
  const [transaction, setTransaction] = useState<Transaction>({
    type: 'payment',
    name: '',
    amount: '',
    currency: 'SOL',
    recipient: '',
    memo: '',
    paymentMethod: 'wallet'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTransaction(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setTransaction(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Transaction Submitted",
        description: `Your ${transactionType} transaction has been submitted successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while submitting the transaction.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderTransactionFields = () => {
    switch (transactionType) {
      case 'payment':
        return (
          <>
            <Input
              name="recipient"
              placeholder="Recipient Address"
              value={(transaction as PaymentTransaction).recipient}
              onChange={handleInputChange}
            />
            <Input
              name="memo"
              placeholder="Memo (Optional)"
              value={(transaction as PaymentTransaction).memo}
              onChange={handleInputChange}
            />
          </>
        )
      case 'gift':
        return (
          <>
            <Input
              name="recipient"
              placeholder="Recipient"
              value={(transaction as GiftTransaction).recipient}
              onChange={handleInputChange}
            />
            <Input
              name="message"
              placeholder="Message"
              value={(transaction as GiftTransaction).message}
              onChange={handleInputChange}
            />
          </>
        )
      case 'nft':
        return (
          <>
            <Input
              name="description"
              placeholder="NFT Description"
              value={(transaction as NFTTransaction).description}
              onChange={handleInputChange}
            />
            <Input
              type="file"
              name="image"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setTransaction(prev => ({ ...prev, image: file }))
              }}
            />
          </>
        )
      case 'donation':
        return (
          <>
            <Input
              name="cause"
              placeholder="Cause"
              value={(transaction as DonationTransaction).cause}
              onChange={handleInputChange}
            />
            <Input
              type="checkbox"
              name="anonymous"
              checked={(transaction as DonationTransaction).anonymous}
              onChange={(e) => handleSelectChange('anonymous', e.target.checked ? 'true' : 'false')}
            />
          </>
        )
      case 'memo':
        return (
          <Input
            name="content"
            placeholder="Memo Content"
            value={(transaction as MemoTransaction).content}
            onChange={handleInputChange}
          />
        )
      // Add other case-specific fields as needed
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        value={transactionType}
        onValueChange={(value: TransactionType) => {
          setTransactionType(value)
          setTransaction({ type: value, name: '' } as Transaction)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select transaction type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="payment">Payment</SelectItem>
          <SelectItem value="gift">Gift</SelectItem>
          <SelectItem value="nft">NFT</SelectItem>
          <SelectItem value="donation">Donation</SelectItem>
          <SelectItem value="transaction">General Transaction</SelectItem>
          <SelectItem value="memo">Memo</SelectItem>
          <SelectItem value="crowdfunding">Crowdfunding</SelectItem>
          <SelectItem value="subscription">Subscription</SelectItem>
        </SelectContent>
      </Select>

      <Input
        name="name"
        placeholder="Transaction Name"
        value={transaction.name}
        onChange={handleInputChange}
      />

      {renderTransactionFields()}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Transaction'
        )}
      </Button>
    </form>
  )
}