// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VotingdappjpIDL from '../target/idl/votingdappjp.json'
import type { Votingdappjp } from '../target/types/votingdappjp'

// Re-export the generated IDL and type
export { Votingdappjp, VotingdappjpIDL }

// The programId is imported from the program IDL.
export const VOTINGDAPPJP_PROGRAM_ID = new PublicKey(VotingdappjpIDL.address)

// This is a helper function to get the Votingdappjp Anchor program.
export function getVotingdappjpProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...VotingdappjpIDL, address: address ? address.toBase58() : VotingdappjpIDL.address } as Votingdappjp, provider)
}

// This is a helper function to get the program ID for the Votingdappjp program depending on the cluster.
export function getVotingdappjpProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Votingdappjp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return VOTINGDAPPJP_PROGRAM_ID
  }
}
