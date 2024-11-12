use anchor_lang::prelude::*;

declare_id!("7RXoiLFXMpXsAcWmgL877y54V8TtkSGorSA6wjv2gy8w");

#[program]
pub mod program2 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("[Program 2] Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
