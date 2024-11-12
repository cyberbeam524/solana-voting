// use anchor_lang::prelude::*;

// declare_id!("FHMLXhyqhWVUdZB3VUHtKfTkaFwTSj5zexMdNb8r3sKW");

// #[program]
// pub mod kinobi_test {
//     use super::*;

//     pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
//         msg!("Greetings from: {:?}", ctx.program_id);
//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct Initialize {}



// use anchor_lang::prelude::*;
// // use anchor_lang::system_program::ID;

// declare_id!("FHMLXhyqhWVUdZB3VUHtKfTkaFwTSj5zexMdNb8r3sKW"); // Replace with your program ID

// #[program]
// pub mod kinobi_test {
//     use super::*;

//     pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
//         msg!("initialize function created at program_id: {:?}", ctx.program_id);
//         ctx.accounts.pda.set_inner(ExampleStruct {
//             data: 0,
//             authority: *ctx.accounts.payer.key,
//  });
//         Ok(())
//  }

//     pub fn set_data(ctx: Context<SetData>, data: u32) -> Result<()> {
//         msg!("set_data function created at program_id: {:?}", ctx.program_id);
//         ctx.accounts.pda.data = data;
//         Ok(())
//  }
// }

// #[derive(Accounts)]
// pub struct Initialize<'info> {
//  #[account(mut)]
//     payer: Signer<'info>,

//  #[account(
//  init,
//  payer = payer,
//  space = 45,
//  seeds = [b"example".as_ref(), payer.key().as_ref()],
//         bump
//  )]
//     pda: Account<'info, ExampleStruct>,

//     system_program: Program<'info, System>,
// }


// #[derive(Accounts)]
// pub struct SetData<'info> {
//  #[account(mut)]
//     authority: Signer<'info>,

//  #[account(
//         mut,
//  has_one = authority,
//  seeds = [b"example".as_ref(), authority.key().as_ref()],
//         bump
//  )]
//     pda: Account<'info, ExampleStruct>,
// }

// #[account]
// pub struct ExampleStruct {
//     pub data: u32,
//     pub authority: Pubkey,
// }




use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::system_program;
// use borsh::{BorshDeserialize, BorshSerialize};
use std::iter::repeat;
// use anchor_lang::system_program::ID;

declare_id!("FHMLXhyqhWVUdZB3VUHtKfTkaFwTSj5zexMdNb8r3sKW");


// solana program show FHMLXhyqhWVUdZB3VUHtKfTkaFwTSj5zexMdNb8r3sKW
// Program Id: FHMLXhyqhWVUdZB3VUHtKfTkaFwTSj5zexMdNb8r3sKW
// Owner: BPFLoaderUpgradeab1e11111111111111111111111
// ProgramData Address: Fw5P9nSZa5qSVwe1kR79w5kCJjP4pZsDSmh9wbSZy9wg
// Authority: 8uUZ4Abv7UViPEscwMU93YjsHzQwyTCrNiqo3nUwY1R4
// Last Deployed In Slot: 11687
// Data Length: 249160 (0x3cd48) bytes
// Balance: 1.73535768 SOL

// https://docs.rs/anchor-lang/latest/anchor_lang/error/enum.ErrorCode.html
#[error_code]
// #[error]
pub enum ErrorCode {
    #[msg("Need to be more than one option")]
    TooLittleOptions,
}

// // #[derive(Error, Debug, Copy, Clone)]
// pub enum ErrorCode {
//     #[msg("The provided topic should be 50 characters long maximum.")]
//     TopicTooLong,
//     #[msg("The provided content should be 280 characters long maximum.")]
//     ContentTooLong,
// }

impl From<ErrorCode> for ProgramError {
    fn from(e: ErrorCode) -> Self {
        msg!("{}", e);
        ProgramError::Custom(e as u32)
    }
}

#[program]
pub mod solana_voting {
    use super::*;
        pub fn create_votetopic(ctx: Context<InitializeVoteTopic>, topic: String, options: String) -> ProgramResult {
        msg!("create_votetopic to this topic now: {:#?} with options: {:#?}", topic, options);

        // let bump = ctx.bumps.get("votetopic").unwrap();
       
        // msg!("Derived PDA: {}, Bump: {}", ctx.accounts.votetopic.key(), bump);



        // // Convert `topic` to a fixed-length byte array
        // let mut topic_bytes = [0u8; 32];
        // let topic_slice = topic.as_bytes();
        // topic_bytes[..topic_slice.len()].copy_from_slice(topic_slice);

        // // Assign to topic_seed
        // ctx.accounts.topic_seed = topic_bytes;


        let splitOptions: Vec<&str>  = options.split(',').collect();
        msg!("options are: {:#?}, with length: {:#?}", splitOptions, splitOptions.len());
        if splitOptions.len() <= 1 {
            return Err(ErrorCode::TooLittleOptions.into())
        }

        let votetopic: &mut Account<Votetopic> = &mut ctx.accounts.votetopic;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        votetopic.author = *author.key;
        votetopic.timestamp = clock.unix_timestamp;
        votetopic.topic = topic;
        votetopic.options = options;
        votetopic.votes = vec![];
        // votetopic.bump = ctx.bumps.votetopic;
        // votetopic.voters = vec![*author.key];
        // votetopic.voters = vec![(*author.key).to_string()];
        // votetopic.voters = vec![];
        msg!("votetopic with 0 voters: {:#?}", votetopic.voters);

        Ok(())
    }


    // pub fn register_voter(ctx: Context<RegisterVoter>, random: String) -> ProgramResult {
    //     msg!("entered create_votetopic methodddd");
    //     let votetopic: &mut Account<Votetopic> = &mut ctx.accounts.votetopic;
    //     votetopic.voters.push(random);
    //     msg!("votetopic with added voters: {:#?}", votetopic.voters);
    //     Ok(())
    // }

    pub fn register_voter_own(ctx: Context<RegisterVoterOwn>, random: String) -> ProgramResult {
        msg!("entered register_voter_own methodddd");
        let votetopic: &mut Account<Votetopic> = &mut ctx.accounts.votetopic;
        let author: &Signer = &ctx.accounts.voter;
        msg!("votetopic with before voters: {:#?}", votetopic.voters);
        votetopic.voters.push(*author.key);
        votetopic.votes.push(0);
        // 0 -- means never vote:
         // 1 -- means option index +1 -- so first option voted here
        
        // votetopic.voters.push(random);
        
        msg!("votetopic with current votes: {:#?}", votetopic.votes);
        msg!("votetopic with added voters: {:#?}", votetopic.voters);
        Ok(())
    }

    // pub fn voter_vote(ctx: Context<RegisterVoterOwn>, random: String) -> ProgramResult {
    //     msg!("entered register_voter_own methodddd");
    //     let votetopic: &mut Account<Votetopic> = &mut ctx.accounts.votetopic;
    //     let author: &Signer = &ctx.accounts.voter;
    //     msg!("votetopic with before voters: {:#?}", votetopic.voters);
    //     votetopic.voters.push(*author.key);
    //     votetopic.vote.push(0);
    //     // 0 -- means never vote:
    //      // 1 -- means option index +1 -- so first option voted here
        
    //     // votetopic.voters.push(random);
    //     msg!("votetopic with added voters: {:#?}", votetopic.voters);
    //     msg!("votetopic with current votes: {:#?}", votetopic.voters);
    //     Ok(())
    // }

    // pub fn register_voter_own(ctx: Context<RegisterVoterOwn>, random: String) -> ProgramResult {
    //     msg!("entered register_voter_own methodddd");
    //     let votetopic: &mut Account<Votetopic> = &mut ctx.accounts.votetopic;
    //     let author: &Signer = &ctx.accounts.voter;
    //     msg!("votetopic with before voters: {:#?}", votetopic.voters);
    //     votetopic.voters.push(*author.key);
    //     // votetopic.voters.push(random);
    //     msg!("votetopic with added voters: {:#?}", votetopic.voters);
    //     Ok(())
    // }



    pub fn modify_option(ctx: Context<ModifyOptionC>, newOptions: String) -> ProgramResult {
        msg!("entered modify_option methodddd");

        let votetopic: &mut Account<Votetopic> = &mut ctx.accounts.votetopic;

        let mut splitOptions: Vec<&str>  = votetopic.options.split(',').collect();
        let mut newOptionsSplit: Vec<&str>  = newOptions.split(',').collect();
        // msg!("existing options: {:#?}", &splitOptions);
        let res = [splitOptions, newOptionsSplit].concat();

        
        let joined = res.join(",");
        votetopic.options = joined;
        msg!("new options: {:#?}", votetopic.options);

        // votetopic.options = 
        // msg!("votetopic with 0 voters: {:#?}", votetopic.voters);

        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, voteOption: String) -> ProgramResult {
        msg!("entered vote methodddd");
        let voter: &Signer = &ctx.accounts.voter;
        let votetopic: &mut Account<Votetopic> = &mut ctx.accounts.votetopic;
        // msg!("votetopic with before voters: {:#?}", votetopic.voters);
        
        let index = votetopic.voters.iter().position(|&r| r == *voter.key).unwrap();
        let options: Vec<&str> = votetopic.options.split(",").collect();
        let option_index = options.iter().position(|&r| r.to_string() == voteOption).unwrap();
        votetopic.votes[index] = option_index as i64 + 1;
        // println!("{}", index);


        // votetopic.voters.push(*voter.key);
        // votetopic.votes.push(0);

        Ok(())
    }



}


#[derive(Accounts)]
pub struct InitializeVoteTopic<'info> {
    #[account(init, 
        payer = author, 
        space = Votetopic::LEN, 
        // seeds = [b"votetopic".as_ref(), author.key().as_ref()],
        seeds = [b"votetopic2".as_ref(), author.key().as_ref()],
            bump)]
    pub votetopic: Account<'info, Votetopic>,
    #[account(mut)]
    pub author: Signer<'info>,
    // #[account(address = system_program::ID)]
    // pub system_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    // pub topic_seed: [u8; 32], // Fixed-length byte array for the topic
}

// #[derive(Accounts)]
// pub struct RegisterVoter<'info> {
//     #[account(mut)]
//     pub votetopic: Account<'info, Votetopic>,
// }


#[derive(Accounts)]
pub struct RegisterVoterOwn<'info> {
    #[account(mut)]
    pub votetopic: Account<'info, Votetopic>,
    #[account(mut)]
    // pub voter: AccountInfo<'info>,
    pub voter: Signer<'info>,
    // pub voter: Pubkey,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub votetopic: Account<'info, Votetopic>,
    #[account(mut)]
    // pub voter: AccountInfo<'info>,
    pub voter: Signer<'info>
    // pub voter: Pubkey,
}

// do we always have to initialise the new signer accounts --- do the signer accounts have to pay for some data with rent fees 
// if someone else is renting the existing data being changed for this account, can i still sign that transaction


#[derive(Accounts)]
pub struct ModifyOptionC<'info> {
    #[account(mut)]
    pub votetopic: Account<'info, Votetopic>,
    // #[account(mut)]
    // // pub voter: AccountInfo<'info>,
    // pub voter: Signer<'info>,
    // pub voter: Pubkey,

}

#[account]
pub struct Votetopic {
    pub author: Pubkey,
    pub timestamp: i64,
    pub topic: String,
    pub options: String,
    // pub voters: Vec<String>,
    pub voters: Vec<Pubkey>,
    // votes can have 3 possible votes:
    pub votes: Vec<i64>,
    // pub voters: Vec<Voter>,
    // bump: u8,
}


// // https://gist.github.com/FrankC01/b03937c5e8c74753eb552ca1e15ba8f8
// // #[account]
// // #[derive(Debug)]
// // make it public unless its anonymous voting:
// #[derive(Debug, BorshDeserialize, BorshSerialize, Default, Clone)]
// pub struct Voter {
//     account: Pubkey,
//     vote: u32,
// }
// // ----didnt work since IdlError: Type not found: {"type":{"defined":"Voter"}} kept appearing during testing:

// impl Voter {
//     fn new(account: Pubkey, vote: u32) -> Self {
//         Voter { account: account, vote: vote, }
//     }
// }

// 2. Add some useful constants for sizing propeties.
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string.
const MAX_TOPIC_LENGTH: usize = 50 * 4; // 50 chars max.
const MAX_CONTENT_LENGTH: usize = 280 * 4; // 280 chars max.

impl Votetopic {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Admin for votetopic.
        + TIMESTAMP_LENGTH // Timestamp.
        + STRING_LENGTH_PREFIX + MAX_TOPIC_LENGTH // Voting Topic.
        + STRING_LENGTH_PREFIX + MAX_CONTENT_LENGTH; // length of voters.
}


