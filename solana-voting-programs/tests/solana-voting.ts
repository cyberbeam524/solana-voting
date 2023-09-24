import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaVoting } from '../target_1/types/solana_voting';
import * as solanaWeb3 from '@solana/web3.js';
import * as assert from "assert";
import * as bs58 from "bs58";

describe('solana-voting', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.SolanaVoting as Program<SolanaVoting>;

  it('create Next Class president for 2023', async () => {
      const votetopic = anchor.web3.Keypair.generate();
      await program.rpc.createVotetopic('Next Class president for 2023', 'Jane, Mary, Elise, Joe, Simpson, Json', {
          accounts: {
              votetopic: votetopic.publicKey,
              author: program.provider.wallet.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
          },
          signers: [votetopic],
      });

  });

  it('create Next president for 2022', async () => {
    const votetopic = anchor.web3.Keypair.generate();
    await program.rpc.createVotetopic('Next president for 2022', 'Donald Trump, Jane Doe, Clinton, John Doe', {
        accounts: {
            votetopic: votetopic.publicKey,
            author: program.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [votetopic],
    });

});

  it('votetopics listed', async () => {
      const votetopics = await program.account.votetopic.all();
      console.log("--------------------------------------------------------------------");
      console.log("ALL THE votetopics currently under this program:", votetopics);
      console.log("--------------------------------------------------------------------");
      
      assert.equal(votetopics.length, 2);

  });

  it('create Next president3 should fail as it only has one option provided', async () => {
      try{
      const votetopic = anchor.web3.Keypair.generate();
      await program.rpc.createVotetopic('Next president3', 'Donald Trump', {
          accounts: {
              votetopic: votetopic.publicKey,
              author: program.provider.wallet.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
          },
          signers: [votetopic],
      });
      }catch (error) {
          // assert.equal(error.msg, 'The provided topic should be 50 characters long maximum.');
          console.log("errorsss:", error.logs);
          assert.equal(error.logs[6], 'Program log: Need to be more than one option');
          return;
      }
      assert.fail('Need to be more than one option');
  });

    it('filtered president for 2022 only', async () => {
      const votetopicAccounts = await program.account.votetopic.all([
          {
              memcmp: {
                  offset: 8 + // Discriminator.
                      32 + // Author public key.
                      8 + // Timestamp.
                      4, // Topic string prefix.
                  bytes: bs58.encode(Buffer.from('Next president for 2022')),
              }
          }
      ]);
      console.log("--------------------------------------------------------------------");
      console.log("ALL THE voter topics matching 'Next president for 2022':", votetopicAccounts);
    //   console.log("voters: ", votetopicAccounts["account"]["voters"]);
    //   console.log("votes: ", votetopicAccounts["account"]["votes"]);
      console.log("--------------------------------------------------------------------");
      const otherUser = anchor.web3.Keypair.generate();
      assert.equal(votetopicAccounts.length, 1);
  })

  it.skip('registerVoter2', async () => {
      const votetopicAccounts = await program.account.votetopic.all([
          {
              memcmp: {
                  offset: 8 + // Discriminator.
                      32 + // Author public key.
                      8 + // Timestamp.
                      4, // Topic string prefix.
                  bytes: bs58.encode(Buffer.from('Next president for 2022')),
              }
          }
      ]);
      console.log("--------------------------------------------------------------------");
      console.log("ALL THE voter topics matching 'Next president for 2022':", votetopicAccounts);
      console.log("--------------------------------------------------------------------");
      const otherUser = anchor.web3.Keypair.generate();
      const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
      await program.provider.connection.confirmTransaction(signature);
      let tx;
      for (let votetopic of votetopicAccounts){

          // tx = await program.rpc.registerVoter("",{
          //     accounts: {
          //         votetopic: votetopic.publicKey,
          //         // voter: otherUser.publicKey,
          //         // systemProgram: anchor.web3.SystemProgram.programId,
          //     },
          //     signers: [votetopic],
          // });
          // break;

          tx = await program.rpc.registerVoter(otherUser.publicKey.toString(),{
              accounts: {
                  votetopic: votetopic.publicKey,
                  // voter: otherUser.publicKey,
                  // systemProgram: anchor.web3.SystemProgram.programId,
              },
            //   signers: [votetopic],
          });
          break;
      }

      // https://github.com/coral-xyz/anchor/issues/1109
      // // https://dev.to/qpwo/how-to-sign-anchor-transactions-with-phantom-or-other-wallets-in-the-browser-845

      assert.equal(votetopicAccounts.length, 1);
  });



  it('registerVoterOwn', async () => {
    const votetopicAccounts = await program.account.votetopic.all([
        {
            memcmp: {
                offset: 8 + // Discriminator.
                    32 + // Author public key.
                    8 + // Timestamp.
                    4, // Topic string prefix.
                bytes: bs58.encode(Buffer.from('Next president for 2022')),
            }
        }
    ]);
    console.log("--------------------------------------------------------------------");
    console.log("ALL THE voter topics matching 'Next president for 2022':", votetopicAccounts);
    // console.log("voters: ", votetopicAccounts["account"].voters);
    // console.log("votes: ", votetopicAccounts["account"]["votes"]);
    console.log("--------------------------------------------------------------------");
    const otherUser = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);
    let tx;
    for (let votetopic of votetopicAccounts){

        tx = await program.rpc.registerVoterOwn(otherUser.publicKey.toString(),{
            accounts: {
                votetopic: votetopic.publicKey,
                voter: otherUser.publicKey,
                // systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [otherUser],
        });
        break;
    }
    assert.equal(votetopicAccounts.length, 1);
});



it.skip('registerVoterOwn shd fail if its a different account signing', async () => {
    const votetopicAccounts = await program.account.votetopic.all([
        {
            memcmp: {
                offset: 8 + // Discriminator.
                    32 + // Author public key.
                    8 + // Timestamp.
                    4, // Topic string prefix.
                bytes: bs58.encode(Buffer.from('Next president for 2022')),
            }
        }
    ]);
    console.log("--------------------------------------------------------------------");
    console.log("ALL THE voter topics matching 'Next president for 2022':", votetopicAccounts);
    console.log("--------------------------------------------------------------------");
    const otherUser1 = anchor.web3.Keypair.generate();
    const signature1 = await program.provider.connection.requestAirdrop(otherUser1.publicKey, 1000000000);
    const otherUser = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);
    let tx;
    for (let votetopic of votetopicAccounts){

        // tx = await program.rpc.registerVoterOwn(otherUser.publicKey.toString(),{
        //     accounts: {
        //         votetopic: votetopic.publicKey,
        //         voter: otherUser1.publicKey,
        //         // systemProgram: anchor.web3.SystemProgram.programId,
        //     },
        //     signers: [otherUser],
        // });
        // break;

        tx = await program.rpc.registerVoterOwn(otherUser.publicKey.toString(),{
            accounts: {
                votetopic: votetopic.publicKey,
                voter: otherUser.publicKey,
                // systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [otherUser1],
        });
        break;
    }
    assert.equal(votetopicAccounts.length, 1);
});


  it.skip('MODIFY Next president for 2022', async () => {
    const tweetAccounts = await program.account.votetopic.all([
        {
            memcmp: {
                offset: 8 + // Discriminator.
                    32 + // Author public key.
                    8 + // Timestamp.
                    4, // Topic string prefix.
                bytes: bs58.encode(Buffer.from('Next president for 2022')),
            }
        }
    ]);
    console.log("ALL THE TWEETS:", tweetAccounts);

    for (let tweet of tweetAccounts){
      // console.log("currtweet", tweet.publicKey);
      await program.rpc.modifyOption('veganism5', {
        accounts: {
            votetopic: tweet.publicKey,
            // author: program.provider.wallet.publicKey,
            // systemProgram: anchor.web3.SystemProgram.programId,
        },
        // signers: [ program.provider.wallet, tweet],
    });
    // break;
      
    }

    console.log("---------------------------------------------AFTER MODIFYING----------------");

    
    
    assert.equal(tweetAccounts.length, 1);
    // let counter = 0;
    // assert.ok(tweetAccounts.every(tweetAccount => {
    //   console.log(counter, ". ", tweetAccount);
    //   counter++;
    //     return tweetAccount.account.topic === 'veganism3'
    // }))
  });



  it('register and vote', async () => {
    const votetopicAccounts = await program.account.votetopic.all([
        {
            memcmp: {
                offset: 8 + // Discriminator.
                    32 + // Author public key.
                    8 + // Timestamp.
                    4, // Topic string prefix.
                bytes: bs58.encode(Buffer.from('Next president for 2022')),
            }
        }
    ]);
    console.log("--------------------------------------------------------------------");
    console.log("ALL THE voter topics matching 'Next president for 2022':", votetopicAccounts);
    console.log("voters: ", votetopicAccounts["account"].voters);
    console.log("votes: ", votetopicAccounts["account"]["votes"]);
    console.log("--------------------------------------------------------------------");
    const otherUser = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);
    let tx;
    for (let votetopic of votetopicAccounts){

        tx = await program.rpc.registerVoterOwn(otherUser.publicKey.toString(),{
            accounts: {
                votetopic: votetopic.publicKey,
                voter: otherUser.publicKey,
                // systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [otherUser],
        });
        break;
    }
    assert.equal(votetopicAccounts.length, 1);
});




});