use std::{str::FromStr, thread};

use solana_client::{pubsub_client, rpc_client::RpcClient};
use solana_sdk::{account::Account, pubkey::Pubkey};


use solana_client::rpc_config::RpcTransactionLogsFilter;
use solana_sdk::commitment_config::CommitmentConfig;
use solana_client::rpc_config::RpcTransactionLogsConfig;

use crate::{establish_connection, models::LogStream,};
// use crate::{establish_connection};

pub fn subscribe_to_programlogs() {
    let url = "ws://localhost:8900".to_string();
    // let programID = "85GB2GBrh15nj5vwfPLZBDW4NHqUuWuXeeago9oUEtnJ";
    let programID = "85GB2GBrh15nj5vwfPLZBDW4NHqUuWuXeeago9oUEtnJ";
    let program_pub_key = Pubkey::from_str(programID)
        .expect("program address invalid");

    thread::spawn(move || loop {
        let subscription =
            pubsub_client::PubsubClient::logs_subscribe(&url, 
                RpcTransactionLogsFilter::All,
                RpcTransactionLogsConfig { commitment: Some(CommitmentConfig::recent()) })
                .expect("Something went wrong subscribe_to_programlogs");

             // connect to database:
        let conn = establish_connection();
        loop {
            println!("Connection established. Accessing program logs for programID:{} now....", programID);
            let response = subscription.1.recv();
            println!("2this is the response: {:#?}", response);
            match response {
                Ok(response) => {
                    let pda_account: Vec<String> = response.value.logs;
                    let mut filteredLogs: Vec<String> = vec![];
                    for text in &pda_account {
                        if text.starts_with(&String::from("Program BPFLoaderUpgradeab")){
                            println!("Ignoring {}.", text);
                        }else{
                            filteredLogs.push(text.to_string());
                        }
                        
                    }

                    if filteredLogs.len() == 0{
                        continue;
                    }

                    let stream = LogStream::new(filteredLogs);
                    match stream {
                        Some(a) => {
                            println!("1. inserting into table happening here, a: {:#?}", a);
                            let result = LogStream::insert_or_update(a, &conn);
                            if result != true{
                                println!("it didnt get inserted!");
                            }
                            continue;
                        },
                        _ => {
                            println!("data didn't parsed");
                            continue;
                        }
                    };
                }
                Err(_) => {
                    println!("error!");
                    break;
                }
            }
        }
    });
}



fn get_all_program_accounts() -> Vec<(Pubkey, Account)> {
    // 7sQC1QExqkVZBgxnP8ra25NgCrqe4rQSwTThtVuV9zqk
    let programID = "85GB2GBrh15nj5vwfPLZBDW4NHqUuWuXeeago9oUEtnJ";
    let program_pub_key = Pubkey::from_str(programID)
        .expect("program address invalid");
        // https://docs.rs/solana-client/1.7.11/solana_client/rpc_client/struct.RpcClient.html
    // let url = "https://api.devnet.solana.com".to_string();
    // let url = "http://localhost:8899".to_string();
    let url = "http://localhost:8899".to_string();
    // let url = "ws://localhost:8900".to_string();
    let client = RpcClient::new(url);

    client
        .get_program_accounts(&program_pub_key)
        .expect("Something went wrong here get_all_program_accounts")
}
