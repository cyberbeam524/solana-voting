# solana-voting

Firstly, install solana and anchor as shown in the guide https://book.anchor-lang.com/getting_started/installation.html.

:white_check_mark: Two vote topics ('Next Class president for 2023' and 'Next president for 2022') were created here by the admin with various options separated by comma. :ok_woman:, :ok_person:, :ok_man:

![alt text](https://github.com/cyberbeam524/solana-voting/blob/main/imgs/voteTopicsCreated.png)

:x: Error was thrown in the solana program when only one option with no commas was provided. It does not make sense for vote topics to be provided with only one option and so this is to prevent admins from creating such voting topics. 

:eight_pointed_black_star: The solana-voting program can also be filtered for vote topics such as 'Next president for 2022' which is shown below with its respective options.

![alt text](https://github.com/cyberbeam524/solana-voting/blob/main/imgs/errorForOneOption.png)



## Steps for using sol-stream-voting API to get logs from solana program:

Open 4 terminals

Terminal #1: Start solana local testnet.
```
solana config set --url localhost
solana-test-validator --no-bpf-jit --reset
```

Terminal #2:
```
solana logs
```

Terminal #3:
```
cd solana-voting-programs
anchor build
anchor deploy
```
Take note of programId displayed:
![alt text](https://github.com/cyberbeam524/solana-voting/blob/main/imgs/programIDDeployment.png)

Place programId in solana-voting-programs/programs/solana-voting/src/lib.rs in line 7:
```
declare_id!("85GB2GBrh15nj5vwfPLZBDW4NHqUuWuXeeago9oUEtnJ") 
```

Place programId in solana-voting-programs/Anchor.toml in line 2: 
```
solana_voting = "85GB2GBrh15nj5vwfPLZBDW4NHqUuWuXeeago9oUEtnJ"
```

Place programId in sol-stream-voting/src/solana.rs in line 16 and 81: 
```
let programID = "85GB2GBrh15nj5vwfPLZBDW4NHqUuWuXeeago9oUEtnJ";
```

Terminal #4: Running diesel API for listening to events
Set sol-stream-voting/.env to postgresql database url.
```
cd sol-stream-voting 
cargo check
diesel migration redo
cargo run
```

Go back to Terminal #3:
```
anchor run test2
```
After the test have been run, it will generate logs related to the program you have deployed on the solana local testnet in terminal #4 and terminal #2.

You should be able to see these program logs in the API terminal and the postgresql table 'logstreams'. It will  be similar to sampleProgramLogsPostgresql.csv!


A sample log row that is created after CreateVotetopic program function is triggered and some details it includes are:
- what the topic is
- options that are provided
- unixDateTime it was created
- whether these details have been displayed on the frontend or not

3,"Program 85GB2GBrh15nj5vwfPLZBDW4NHqUuWuXeeago9oUEtnJ invoke [1]|||Program log: Instruction: CreateVotetopic|||Program 11111111111111111111111111111111 invoke [2]|||Program 11111111111111111111111111111111 success|||**Program log: create_votetopic to this topic now: ""Next Class president for 2023"" with options: ""Jane, Mary, Elise, Joe, Simpson, Json""**|||**Program log: options are: [
    ""Jane"",
    "" Mary"",
    "" Elise"",
    "" Joe"",
    "" Simpson"",
    "" Json"",
], with length: 6**|||Program log: votetopic with 0 voters: [
    ""3xfx7HR2X4RV99zeZZcCkiv5BLsrG1ydbypmx8RRHVmK"",
]|||Program 85GB2GBrh15nj5vwfPLZBDW4NHqUuWuXeeago9oUEtnJ consumed 74588 of 200000 compute units|||Program 85GB2GBrh15nj5vwfPLZBDW4NHqUuWuXeeago9oUEtnJ success",**1657618538**,**False**




export PATH="/home/maars505/.local/share/solana/install/active_release/bin:$PATH"
warning: be sure to add `/home/maars505/.cargo/bin` to your PATH to be able to run the installed binaries


Rust is installed now. Great!

To get started you may need to restart your current shell.
This would reload your PATH environment variable to include
Cargo's bin directory ($HOME/.cargo/bin).

To configure your current shell, you need to source
the corresponding env file under $HOME/.cargo.

This is usually done by running one of the following (note the leading DOT):
. "$HOME/.cargo/env"            # For sh/bash/zsh/ash/dash/pdksh
source "$HOME/.cargo/env.fish"  # For fish


psql postgres://postgres:123@localhost:5433/logstreams2

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion



lsof -i :8000
kill -9 <PID>



