'use client'

import { getVotingdappjpProgram, getVotingdappjpProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useVotingdappjpProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVotingdappjpProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getVotingdappjpProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['votingdappjp', 'all', { cluster }],
    queryFn: () => program.account.votingdappjp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['votingdappjp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ votingdappjp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useVotingdappjpProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVotingdappjpProgram()

  const accountQuery = useQuery({
    queryKey: ['votingdappjp', 'fetch', { cluster, account }],
    queryFn: () => program.account.votingdappjp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['votingdappjp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ votingdappjp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['votingdappjp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ votingdappjp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['votingdappjp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ votingdappjp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['votingdappjp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ votingdappjp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
