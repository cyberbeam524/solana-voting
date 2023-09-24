// import twitterLogo from './assets/twitter-logo.svg';
// import './App.css';

// // Constants
// const TWITTER_HANDLE = '_buildspace';
// const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// const App = () => {
//   return (
//     <div className="App">
//       <div className="container">
//         <div className="header-container">
//           <p className="header">🖼 GIF Portal</p>
//           <p className="sub-text">
//             View your GIF collection in the metaverse ✨
//           </p>
//         </div>
//         <div className="footer-container">
//           <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
//           <a
//             className="footer-text"
//             href={TWITTER_LINK}
//             target="_blank"
//             rel="noreferrer"
//           >{`built on @${TWITTER_HANDLE}`}</a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;


/*
 * We are going to be using the useEffect hook!
 */
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// import {
//   Program, 
//   Provider, 
//   // AnchorProvider,
//   web3
// } from '@project-serum/anchor';
// import { Connection, PublicKey } from '@solana/web3.js';

import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import SimpleAccordion from './components/Accordian';
import idl from './greetingidl.json';
import idl2 from './votingidl.json';

// Change this up to be your Twitter if you want.
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;



// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
let baseAccount = Keypair.generate();

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);
const programID2 = new PublicKey(idl2.metadata.address);

// Set our network to devnet.
// const network = clusterApiUrl('devnet');
const network = "http://127.0.0.1:8899";

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}


const App = () => {
  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [value, setValue] = useState(null);
  const [votetopics, setVoteTopics] = useState([]);


  // // second set:
  // const wallet = useWallet()
  // console.log("wallet object: ", wallet)
  // const connection = new Connection('http://127.0.0.1:8899')
  // console.log("wallet.value:", wallet.value)

  // // const provider2 = computed(() => new AnchorProvider(connection, wallet.value, { preflightCommitment, commitment }))
  // const provider2 = computed(() => new AnchorProvider(connection, wallet.value, opts))
  // // const provider = computed(() => new AnchorProvider(connection, wallet, anchor.Provider.defaultOptions()))
  // // anchor.Provider.defaultOptions()
  // const program = computed(() => new Program(idl, programID, provider.value))
  // const program2 = computed(() => new Program(idl, programID, provider2.value))
  // console.log("this is the anchor program that is not working because of anchor provider:", program)


  // // second set:


  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    // const provider = new AnchorProvider(
    //   connection, window.solana, opts.preflightCommitment,
    // );
    return provider;
  }

  async function createCounter() {    
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);
    console.log(program);
    try {
      /* interact with the program via rpc */
      await program.rpc.create({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('account: ', account);
      setValue(account.count.toString());
    } catch (err) {
      console.log("Transaction error: ", err);
    }

    // try {
    //   const provider = getProvider();
    //   const program = new Program(idl, programID, provider);
  
    //   await program.rpc.addGif(inputValue, {
    //     accounts: {
    //       baseAccount: baseAccount.publicKey,
    //       user: provider.wallet.publicKey,
    //     },
    //   });
    //   console.log("GIF successfully sent to program", inputValue)
  
    //   await getGifList();
    // } catch (error) {
    //   console.log("Error sending GIF:", error)
    // }
  }






const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log('Phantom wallet found!');
                /*
         * The solana object gives us a function that will allow us to connect
         * directly with the user's wallet!
         */
                const response = await solana.connect({ onlyIfTrusted: true });
                
                console.log(
                  'Connected with Public Key:',
                  response.publicKey.toString()
                );
                setWalletAddress(response.publicKey.toString());


      }
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};


  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  const connectWallet = async () => {
    const { solana } = window;
  
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );


  async function getVoteTopics() {    
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl2, programID2, provider);
    console.log(program);
    // try {
    //   /* interact with the program via rpc */
    //   await program.rpc.create({
  const votetopicAccounts = await program.account.votetopic.all()
  console.log("votetopics: ", votetopicAccounts);
    setVoteTopics(votetopicAccounts);
  }

/*
 * When our component first mounts, let's check to see if we have a connected
 * Phantom Wallet
 */
useEffect(async () => {

  
  const onLoad = async () => {
    await checkIfWalletIsConnected();
    await getVoteTopics();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
  
}, []);


return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header">🖼 GIF Portal</p>
        <p className="sub-text">
          View your GIF collection in the metaverse ✨
          {
            !value && (<button onClick={createCounter}>Create counter</button>)
          }
        </p>
        {/* Render your connect to wallet button right here */}
        {renderNotConnectedContainer()}
      </div>
      <div>
      <SimpleAccordion topics={votetopics} />
      </div>
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built on @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  </div>
);
};
export default App;
