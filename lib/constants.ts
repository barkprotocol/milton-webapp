import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  AccountLayout,
  createMintToInstruction,
  createTransferInstruction,
  createCloseAccountInstruction,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  Signer,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

// Public key for the treasury wallet
export const TREASURY_WALLET_PUBKEY = new PublicKey(
  "gEb7nD9yLkau1P4uyMdke9byJNrat61suH4vYiPUuiR"
);

/**
 * Log a message to the console.
 * @param message - The message to log.
 */
function log(message: string) {
  console.log(`[Governance Log]: ${message}`);
}

/**
 * Log an error message.
 * @param error - The error to log.
 */
function logError(error: any) {
  console.error(`[Governance Error]:`, error);
}

/**
 * Get the associated token address for a given mint and owner.
 * @param mint - The mint address of the token.
 * @param owner - The public key of the token account owner.
 * @returns The associated token address.
 */
export async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
}

/**
 * Create a transaction instruction for creating an associated token account.
 * @param payer - The payer of the transaction (usually the user).
 * @param associatedTokenAddress - The address of the associated token account.
 * @param owner - The owner of the associated token account.
 * @param mint - The token mint address.
 * @returns A TransactionInstruction for creating the associated token account.
 */
export function createAssociatedTokenAccountInstruction(
  payer: PublicKey,
  associatedTokenAddress: PublicKey,
  owner: PublicKey,
  mint: PublicKey
): TransactionInstruction {
  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.alloc(0), // The instruction data (empty in this case)
  });
}

/**
 * Fetch the balance of a given token account.
 * @param connection - The Solana connection.
 * @param tokenAccountAddress - The public key of the associated token account.
 * @returns The balance of the token account.
 */
export async function getTokenAccountBalance(
  connection: Connection,
  tokenAccountAddress: PublicKey
): Promise<number> {
  const accountInfo = await connection.getAccountInfo(tokenAccountAddress);
  if (!accountInfo) {
    throw new Error("Token account not found");
  }

  const tokenAccount = AccountLayout.decode(accountInfo.data);
  return tokenAccount.amount.toNumber(); // Convert the balance from BN to number
}

/**
 * Ensure the associated token account exists; create it if it does not.
 * @param connection - The Solana connection.
 * @param payer - The public key of the payer (user).
 * @param mint - The mint address of the token.
 * @param owner - The public key of the token account owner.
 * @returns The associated token address.
 */
export async function ensureAssociatedTokenAccount(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  const associatedTokenAddress = await getAssociatedTokenAddress(mint, owner);

  const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
  if (accountInfo) {
    log(`Associated token account exists: ${associatedTokenAddress}`);
    return associatedTokenAddress; // Account exists, return it
  }

  // Account doesn't exist, create it
  const transactionInstruction = createAssociatedTokenAccountInstruction(
    payer,
    associatedTokenAddress,
    owner,
    mint
  );

  // Here you would typically send this transaction using your connection and payer
  try {
    await sendAndConfirmTransaction(connection, new Transaction().add(transactionInstruction), [payer]);
    log(`Created associated token account: ${associatedTokenAddress}`);
  } catch (error) {
    logError(error);
    throw new Error("Failed to create associated token account");
  }

  return associatedTokenAddress; // Return the address after the transaction is sent
}

/**
 * Transfer tokens from one account to another.
 * @param connection - The Solana connection.
 * @param payer - The public key of the payer (user).
 * @param source - The source token account address.
 * @param destination - The destination token account address.
 * @param amount - The amount of tokens to transfer.
 * @returns The transaction instruction for transferring tokens.
 */
export async function transferTokens(
  connection: Connection,
  payer: Signer,
  source: PublicKey,
  destination: PublicKey,
  amount: number
): Promise<void> {
  const transferInstruction = createTransferInstruction(
    source,
    destination,
    payer.publicKey,
    amount,
    [],
    TOKEN_PROGRAM_ID
  );

  const transaction = new Transaction().add(transferInstruction);

  try {
    await sendAndConfirmTransaction(connection, transaction, [payer]);
    log(`Transferred ${amount} tokens from ${source.toBase58()} to ${destination.toBase58()}`);
  } catch (error) {
    logError(error);
    throw new Error("Token transfer failed");
  }
}

/**
 * Mint new tokens to a specified account.
 * @param connection - The Solana connection.
 * @param payer - The public key of the payer (user).
 * @param mint - The mint address of the token.
 * @param destination - The destination token account address.
 * @param amount - The amount of tokens to mint.
 * @returns The transaction instruction for minting tokens.
 */
export async function mintTokens(
  connection: Connection,
  payer: Signer,
  mint: PublicKey,
  destination: PublicKey,
  amount: number
): Promise<void> {
  const mintInstruction = createMintToInstruction(
    mint,
    destination,
    payer.publicKey,
    amount,
    [],
    TOKEN_PROGRAM_ID
  );

  const transaction = new Transaction().add(mintInstruction);

  try {
    await sendAndConfirmTransaction(connection, transaction, [payer]);
    log(`Minted ${amount} tokens to ${destination.toBase58()}`);
  } catch (error) {
    logError(error);
    throw new Error("Minting tokens failed");
  }
}

/**
 * Close a token account and transfer remaining lamports to the specified address.
 * @param connection - The Solana connection.
 * @param payer - The public key of the payer (user).
 * @param tokenAccount - The token account to close.
 * @param destination - The destination to receive any remaining lamports.
 * @returns The transaction instruction for closing the token account.
 */
export async function closeTokenAccount(
  connection: Connection,
  payer: Signer,
  tokenAccount: PublicKey,
  destination: PublicKey
): Promise<void> {
  const closeInstruction = createCloseAccountInstruction(
    tokenAccount,
    destination,
    payer.publicKey,
    [],
    TOKEN_PROGRAM_ID
  );

  const transaction = new Transaction().add(closeInstruction);

  try {
    await sendAndConfirmTransaction(connection, transaction, [payer]);
    log(`Closed token account: ${tokenAccount.toBase58()}`);
  } catch (error) {
    logError(error);
    throw new Error("Closing token account failed");
  }
}

/**
 * Fetch metadata for a token mint.
 * @param connection - The Solana connection.
 * @param mint - The mint address of the token.
 * @returns Metadata of the token.
 */
export async function getTokenMetadata(connection: Connection, mint: PublicKey) {
  // Implementation for fetching token metadata goes here
  // This might involve querying a metadata program, such as Metaplex
  // Placeholder return value
  return {
    name: "Token Name",
    symbol: "TKN",
    uri: "https://example.com/metadata.json",
  };
}
