// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { KinobiTest } from "../target/types/kinobi_test";

// describe("kinobi-test", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.KinobiTest as Program<KinobiTest>;

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });


// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { KinobiTest } from "../target/types/kinobi_test";

// describe("kinobi-test", () => {
//   anchor.setProvider(anchor.AnchorProvider.env());
//   const program = anchor.workspace.KinobiTest as Program<KinobiTest>;
//   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
//  [
//       Buffer.from("example"),
//       program.provider.publicKey.toBuffer()
//  ],
//     program.programId
//  )
//   it("Is initialized!", async () => {
//     const tx = await program.methods
//  .initialize()
//  .accountsStrict({
//         payer: program.provider.publicKey,
//         pda,
//         systemProgram: anchor.web3.SystemProgram.programId
//  })
//  .rpc();
//  });
//   it("Can set data!", async () => {
//     const tx = await program.methods
//  .setData(10)
//  .accountsStrict({
//         authority: program.provider.publicKey,
//         pda
//  })
//  .rpc({skipPreflight: true});
//  });
// });



// import * as anchor from '@project-serum/anchor';
// import { Program } from '@project-serum/anchor';

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaVoting } from '../target/types/solana_voting';
// import * as solanaWeb3 from '@solana/web3.js';
// import * as assert from "assert";
// import * as bs58 from "bs58";

describe('solana-voting', () => {
    async function airdropSol(publicKey, amount) {    
        let airdropTx = await anchor
            .getProvider()
            .connection.requestAirdrop(
                publicKey, 
                amount * anchor.web3.LAMPORTS_PER_SOL
            );  

        await confirmTransaction(airdropTx);  
    }  

    async function confirmTransaction(tx) {    
        const latestBlockHash = await anchor
            .getProvider()
            .connection.getLatestBlockhash();

        await anchor
            .getProvider()
            .connection.confirmTransaction({      
                blockhash: latestBlockHash.blockhash,      	
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,      
                signature: tx,    
        });  
    }  



  // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.Provider.env());
//   const program = anchor.workspace.SolanaVoting as Program<SolanaVoting>;

    anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.SolanaVoting as Program<SolanaVoting>;
  const [votetopicPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("votetopic"),
      program.provider.publicKey.toBuffer(),
    ],
    program.programId
  );

  it.skip("Creates a vote topic", async () => {
    let topicName = "Next Class president for 2023";
    const newKeypair = anchor.web3.Keypair.generate();
    await airdropSol(newKeypair.publicKey, 10);    
    const [votetopicPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from("votetopic"),
            newKeypair.publicKey.toBuffer(),
          ], // Use unique topicName
        program.programId
      );
      console.log("bump:" , bump);
    const tx = await program.methods
      .createVotetopic(topicName, "Jane, Mary, Elise, Joe, Simpson, Json")
      .accountsStrict({
        votetopic: votetopicPda,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
  });

  it("Creates a vote topic 2025", async () => {
    console.log("program.programId:", program.programId);
    let topicName = "Next Class president for 2025";
    const alice = anchor.web3.Keypair.generate();
    console.log("alice:", alice.publicKey)
    await airdropSol(alice.publicKey, 10);    
    const [votetopicPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
        [ Buffer.from("votetopic2"), alice.publicKey.toBuffer()], // Use unique topicName
        // [Buffer.from("votetopic"), Buffer.from(topicName)], // Same seeds as in the program
        program.programId
      );
      console.log("bump:" , bump);
    const tx = await program.methods
      .createVotetopic(topicName, "Donald Trump, Jane Doe, Clinton, John Doe")
      .accountsStrict({
        votetopic: votetopicPda,
        author: alice.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([alice])
      .rpc();
  });

//     it('votetopics listed', async () => {
//       const votetopics = await program.account.votetopic.all();
//       console.log("--------------------------------------------------------------------");
//       console.log("ALL THE votetopics currently under this program:", votetopics);
//       console.log("--------------------------------------------------------------------");
      
//       assert.equal(votetopics.length, 2);

//   });

//   it('create Next Class president for 2023', async () => {
//       const votetopic = anchor.web3.Keypair.generate();
//       await program.methods.createVotetopic("Next Class president for 2023', 'Jane, Mary, Elise, Joe, Simpson, Json", {
//           accounts: {
//               votetopic: votetopic.publicKey,
//               author: program.provider.publicKey,
//               systemProgram: anchor.web3.SystemProgram.programId,
//           },
//           signers: [votetopic],
//       });

//   });

//   it('create Next president for 2022', async () => {
//     const votetopic = anchor.web3.Keypair.generate();
//     await program.rpc.createVotetopic('Next president for 2022', 'Donald Trump, Jane Doe, Clinton, John Doe', {
//         accounts: {
//             votetopic: votetopic.publicKey,
//             author: program.provider.wallet.publicKey,
//             systemProgram: anchor.web3.SystemProgram.programId,
//         },
//         signers: [votetopic],
//     });

// });

//   it('votetopics listed', async () => {
//       const votetopics = await program.account.votetopic.all();
//       console.log("--------------------------------------------------------------------");
//       console.log("ALL THE votetopics currently under this program:", votetopics);
//       console.log("--------------------------------------------------------------------");
      
//       assert.equal(votetopics.length, 2);

//   });

//   it('create Next president3 should fail as it only has one option provided', async () => {
//       try{
//       const votetopic = anchor.web3.Keypair.generate();
//       await program.rpc.createVotetopic('Next president3', 'Donald Trump', {
//           accounts: {
//               votetopic: votetopic.publicKey,
//               author: program.provider.wallet.publicKey,
//               systemProgram: anchor.web3.SystemProgram.programId,
//           },
//           signers: [votetopic],
//       });
//       }catch (error) {
//           // assert.equal(error.msg, 'The provided topic should be 50 characters long maximum.');
//           console.log("errorsss:", error.logs);
//           assert.equal(error.logs[6], 'Program log: Need to be more than one option');
//           return;
//       }
//       assert.fail('Need to be more than one option');
//   });

//     it('filtered president for 2022 only', async () => {
//       const votetopicAccounts = await program.account.votetopic.all([
//           {
//               memcmp: {
//                   offset: 8 + // Discriminator.
//                       32 + // Author public key.
//                       8 + // Timestamp.
//                       4, // Topic string prefix.
//                   bytes: bs58.encode(Buffer.from('Next president for 2022')),
//               }
//           }
//       ]);
//       console.log("--------------------------------------------------------------------");
//       console.log("ALL THE voter topics matching 'Next president for 2022':", votetopicAccounts);
//     //   console.log("voters: ", votetopicAccounts["account"]["voters"]);
//     //   console.log("votes: ", votetopicAccounts["account"]["votes"]);
//       console.log("--------------------------------------------------------------------");
//       const otherUser = anchor.web3.Keypair.generate();
//       assert.equal(votetopicAccounts.length, 1);
//   })

//   it.skip('registerVoter2', async () => {
//       const votetopicAccounts = await program.account.votetopic.all([
//           {
//               memcmp: {
//                   offset: 8 + // Discriminator.
//                       32 + // Author public key.
//                       8 + // Timestamp.
//                       4, // Topic string prefix.
//                   bytes: bs58.encode(Buffer.from('Next president for 2022')),
//               }
//           }
//       ]);
//       console.log("--------------------------------------------------------------------");
//       console.log("ALL THE voter topics matching 'Next president for 2022':", votetopicAccounts);
//       console.log("--------------------------------------------------------------------");
//       const otherUser = anchor.web3.Keypair.generate();
//       const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
//       await program.provider.connection.confirmTransaction(signature);
//       let tx;
//       for (let votetopic of votetopicAccounts){

//           // tx = await program.rpc.registerVoter("",{
//           //     accounts: {
//           //         votetopic: votetopic.publicKey,
//           //         // voter: otherUser.publicKey,
//           //         // systemProgram: anchor.web3.SystemProgram.programId,
//           //     },
//           //     signers: [votetopic],
//           // });
//           // break;

//           tx = await program.rpc.registerVoter(otherUser.publicKey.toString(),{
//               accounts: {
//                   votetopic: votetopic.publicKey,
//                   // voter: otherUser.publicKey,
//                   // systemProgram: anchor.web3.SystemProgram.programId,
//               },
//             //   signers: [votetopic],
//           });
//           break;
//       }

//       // https://github.com/coral-xyz/anchor/issues/1109
//       // // https://dev.to/qpwo/how-to-sign-anchor-transactions-with-phantom-or-other-wallets-in-the-browser-845

//       assert.equal(votetopicAccounts.length, 1);
//   });



//   it('registerVoterOwn', async () => {
//     const votetopicAccounts = await program.account.votetopic.all([
//         {
//             memcmp: {
//                 offset: 8 + // Discriminator.
//                     32 + // Author public key.
//                     8 + // Timestamp.
//                     4, // Topic string prefix.
//                 bytes: bs58.encode(Buffer.from('Next president for 2022')),
//             }
//         }
//     ]);
//     console.log("--------------------------------------------------------------------");
//     console.log("ALL THE voter topics matching 'Next president for 2022':", votetopicAccounts);
//     // console.log("voters: ", votetopicAccounts["account"].voters);
//     // console.log("votes: ", votetopicAccounts["account"]["votes"]);
//     console.log("--------------------------------------------------------------------");
//     const otherUser = anchor.web3.Keypair.generate();
//     const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
//     await program.provider.connection.confirmTransaction(signature);
//     let tx;
//     for (let votetopic of votetopicAccounts){

//         tx = await program.rpc.registerVoterOwn(otherUser.publicKey.toString(),{
//             accounts: {
//                 votetopic: votetopic.publicKey,
//                 voter: otherUser.publicKey,
//                 // systemProgram: anchor.web3.SystemProgram.programId,
//             },
//             signers: [otherUser],
//         });
//         break;
//     }
//     assert.equal(votetopicAccounts.length, 1);
// });



// it.skip('registerVoterOwn shd fail if its a different account signing', async () => {
//     const votetopicAccounts = await program.account.votetopic.all([
//         {
//             memcmp: {
//                 offset: 8 + // Discriminator.
//                     32 + // Author public key.
//                     8 + // Timestamp.
//                     4, // Topic string prefix.
//                 bytes: bs58.encode(Buffer.from('Next president for 2022')),
//             }
//         }
//     ]);
//     console.log("--------------------------------------------------------------------");
//     console.log("ALL THE voter topics matching 'Next president for 2022':", votetopicAccounts);
//     console.log("--------------------------------------------------------------------");
//     const otherUser1 = anchor.web3.Keypair.generate();
//     const signature1 = await program.provider.connection.requestAirdrop(otherUser1.publicKey, 1000000000);
//     const otherUser = anchor.web3.Keypair.generate();
//     const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
//     await program.provider.connection.confirmTransaction(signature);
//     let tx;
//     for (let votetopic of votetopicAccounts){

//         // tx = await program.rpc.registerVoterOwn(otherUser.publicKey.toString(),{
//         //     accounts: {
//         //         votetopic: votetopic.publicKey,
//         //         voter: otherUser1.publicKey,
//         //         // systemProgram: anchor.web3.SystemProgram.programId,
//         //     },
//         //     signers: [otherUser],
//         // });
//         // break;

//         tx = await program.rpc.registerVoterOwn(otherUser.publicKey.toString(),{
//             accounts: {
//                 votetopic: votetopic.publicKey,
//                 voter: otherUser.publicKey,
//                 // systemProgram: anchor.web3.SystemProgram.programId,
//             },
//             signers: [otherUser1],
//         });
//         break;
//     }
//     assert.equal(votetopicAccounts.length, 1);
// });


//   it.skip('MODIFY Next president for 2022', async () => {
//     const tweetAccounts = await program.account.votetopic.all([
//         {
//             memcmp: {
//                 offset: 8 + // Discriminator.
//                     32 + // Author public key.
//                     8 + // Timestamp.
//                     4, // Topic string prefix.
//                 bytes: bs58.encode(Buffer.from('Next president for 2022')),
//             }
//         }
//     ]);
//     console.log("ALL THE TWEETS:", tweetAccounts);

//     for (let tweet of tweetAccounts){
//       // console.log("currtweet", tweet.publicKey);
//       await program.rpc.modifyOption('veganism5', {
//         accounts: {
//             votetopic: tweet.publicKey,
//             // author: program.provider.wallet.publicKey,
//             // systemProgram: anchor.web3.SystemProgram.programId,
//         },
//         // signers: [ program.provider.wallet, tweet],
//     });
//     // break;
      
//     }

//     console.log("---------------------------------------------AFTER MODIFYING----------------");

    
    
//     assert.equal(tweetAccounts.length, 1);
//     // let counter = 0;
//     // assert.ok(tweetAccounts.every(tweetAccount => {
//     //   console.log(counter, ". ", tweetAccount);
//     //   counter++;
//     //     return tweetAccount.account.topic === 'veganism3'
//     // }))
//   });



//   it('register and vote', async () => {
//     const votetopicAccounts = await program.account.votetopic.all([
//         {
//             memcmp: {
//                 offset: 8 + // Discriminator.
//                     32 + // Author public key.
//                     8 + // Timestamp.
//                     4, // Topic string prefix.
//                 bytes: bs58.encode(Buffer.from('Next president for 2022')),
//             }
//         }
//     ]);
//     console.log("--------------------------------------------------------------------");
//     console.log("ALL THE voter topics matching 'Next president for 2022':", votetopicAccounts);
//     console.log("voters: ", votetopicAccounts["account"].voters);
//     console.log("votes: ", votetopicAccounts["account"]["votes"]);
//     console.log("--------------------------------------------------------------------");
//     const otherUser = anchor.web3.Keypair.generate();
//     const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
//     await program.provider.connection.confirmTransaction(signature);
//     let tx;
//     for (let votetopic of votetopicAccounts){

//         tx = await program.rpc.registerVoterOwn(otherUser.publicKey.toString(),{
//             accounts: {
//                 votetopic: votetopic.publicKey,
//                 voter: otherUser.publicKey,
//                 // systemProgram: anchor.web3.SystemProgram.programId,
//             },
//             signers: [otherUser],
//         });
//         break;
//     }
//     assert.equal(votetopicAccounts.length, 1);
// });

});