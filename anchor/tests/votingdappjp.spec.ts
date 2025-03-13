import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Votingdappjp } from '../target/types/votingdappjp'

describe('votingdappjp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Votingdappjp as Program<Votingdappjp>

  const votingdappjpKeypair = Keypair.generate()

  it('Initialize Votingdappjp', async () => {
    await program.methods
      .initialize()
      .accounts({
        votingdappjp: votingdappjpKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([votingdappjpKeypair])
      .rpc()

    const currentCount = await program.account.votingdappjp.fetch(votingdappjpKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Votingdappjp', async () => {
    await program.methods.increment().accounts({ votingdappjp: votingdappjpKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingdappjp.fetch(votingdappjpKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Votingdappjp Again', async () => {
    await program.methods.increment().accounts({ votingdappjp: votingdappjpKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingdappjp.fetch(votingdappjpKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Votingdappjp', async () => {
    await program.methods.decrement().accounts({ votingdappjp: votingdappjpKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingdappjp.fetch(votingdappjpKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set votingdappjp value', async () => {
    await program.methods.set(42).accounts({ votingdappjp: votingdappjpKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingdappjp.fetch(votingdappjpKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the votingdappjp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        votingdappjp: votingdappjpKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.votingdappjp.fetchNullable(votingdappjpKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
