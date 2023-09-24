use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::system_program;
use borsh::{BorshDeserialize, BorshSerialize};
use std::iter::repeat;

// declare_id!("85GB2GBrh15nj5vwfPLZBDW4NHqUuWuXeeago9oUEtnJ");
declare_id!("9UTX1Zk1tXzNxyWz813HTSkKkqyNFVuH4gawMZK1EwAy");
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
    #[account(init, payer = author, space = Votetopic::LEN)]
    pub votetopic: Account<'info, Votetopic>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
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


