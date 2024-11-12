use std::{str::FromStr, thread};

use solana_client::{pubsub_client, rpc_client::RpcClient};
use solana_sdk::{account::Account, pubkey::Pubkey};


use solana_client::rpc_config::RpcTransactionLogsFilter;
use solana_sdk::commitment_config::CommitmentConfig;
use solana_client::rpc_config::RpcTransactionLogsConfig;

use crate::{establish_connection, models::LogStream,};
use std::sync::Arc;
use crate::DbPool;
use crate::tokio::sync::mpsc;
use crate::tokio::task;
use crate::tokio::time::Instant;
// use crate::{establish_connection};

pub fn subscribe_to_programlogs() {
    let url = "ws://localhost:8900".to_string();
    // let programID = "85GB2GBrh15nj5vwfPLZBDW4NHqUuWuXeeago9oUEtnJ";
    let programID = "6deVmACVgDqx1AhjyfNTxdAtgWkxg5V5TjUaMfgwb8Jm";
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
    let programID = "6deVmACVgDqx1AhjyfNTxdAtgWkxg5V5TjUaMfgwb8Jm";
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



// --------------------------------------2---------------------------------------------
pub async fn subscribe_to_programlogs3(program_id: String, tx: mpsc::Sender<Vec<String>>) {
    let url = "ws://localhost:8900".to_string();

    let subscription = pubsub_client::PubsubClient::logs_subscribe(
        &url,
        RpcTransactionLogsFilter::All,
        RpcTransactionLogsConfig {
            commitment: Some(CommitmentConfig::processed()), // Updated to use `processed`
        },
    )
    .expect("Failed to subscribe to program logs");

    println!("Subscription started for program ID: {}", program_id);

    let response_stream = subscription.1;

    loop {
        // Spawn blocking task to handle synchronous `recv`
        let mut value = response_stream.recv();
        let response = task::spawn_blocking(move || value)
            .await
            .expect("Failed to execute blocking recv");

        match response {
            Ok(response) => {
                // Process the response
                println!("Got response: {:?}", response);

                let filtered_logs: Vec<String> = response
                    .value
                    .logs
                    .into_iter()
                    .filter(|log| !log.starts_with("Program BPFLoaderUpgradeab"))
                    .collect();

                if !filtered_logs.is_empty() {
                    if tx.send(filtered_logs).await.is_err() {
                        println!("Failed to send logs to processor task");
                    }
                }
            }
            Err(err) => {
                println!("Error receiving logs: {:?}", err);
                break;
            }
        }
    }
}

pub async fn subscribe_to_programlogs2(program_id: String, tx: mpsc::Sender<Vec<String>>) {
    let url = "ws://localhost:8900".to_string();

    let subscription = pubsub_client::PubsubClient::logs_subscribe(
        &url,
        RpcTransactionLogsFilter::Mentions(vec![program_id.clone()]), // Filter logs by program_id
        RpcTransactionLogsConfig {
            commitment: Some(CommitmentConfig::processed()),
        },
    )
    .expect("Failed to subscribe to program logs");

    println!("Subscription started for program ID: {}", program_id);

    let response_stream = subscription.1;
    
    loop {
        let start_time = Instant::now(); // Start timer
        let mut value = response_stream.recv();
        let response = task::spawn_blocking(move || value)
            .await
            .expect("Failed to execute blocking recv");

        match response {
            Ok(response) => {
                let elapsed_recv = start_time.elapsed(); // Measure time to receive logs
                println!(
                    "[Streamer: {}] Received logs. Time taken: {:.2?}",
                    program_id, elapsed_recv
                );

                // Filter logs to ensure they match the program_id
                let filtered_logs: Vec<String> = response
                    .value
                    .logs
                    .into_iter()
                    .filter(|log| log.contains(&program_id)) // Explicit filter by program_id
                    .filter(|log| !log.starts_with("Program BPFLoaderUpgradeab")) // Ignore irrelevant logs
                    .collect();

                if !filtered_logs.is_empty() {
                    let send_start_time = Instant::now();
                    if tx.send(filtered_logs).await.is_err() {
                        println!("Failed to send logs to receiver task");
                    } else {
                        let elapsed_send = send_start_time.elapsed();
                        println!(
                            "[Streamer: {}] Logs sent to receiver. Time taken: {:.2?}",
                            program_id, elapsed_send
                        );
                    }
                }
            }
            Err(err) => {
                println!("Error receiving logs for {}: {:?}", program_id, err);
                break;
            }
        }
    }
}





pub async fn process_logs(mut rx: mpsc::Receiver<Vec<String>>, db_pool: Arc<DbPool>) {
    let conn = db_pool.get().expect("Failed to get a DB connection");
    let mut batch = Vec::new();
    while let Some(logs) = rx.recv().await {
        let process_start_time = Instant::now(); // Start timer
        println!("Processing logs: {:?}", logs);
        

        // Create a LogStream instance
        if let Some(log_stream) = LogStream::new(logs) {
            println!("Inserting LogStream into database: {:?}", log_stream);


            batch.push(log_stream);
            if batch.len() >= 100 { // Batch size
                let db_write_start_time = Instant::now(); // Start DB write timer
                // Insert or update the LogStream in the database
                // if !LogStream::insert_or_update(log_stream, &conn) {
                let mut value = LogStream::insert_batch(&batch, &conn);
                if !value {
                    println!("Failed to insert LogStream into database!");
                }else{
                    let db_write_elapsed = db_write_start_time.elapsed();
                    println!(
                        "[Receiver] Logs written to DB. Time taken: {:.2?}",
                        db_write_elapsed
                    );
                }
                batch.clear();
            }
        } else {
            println!("Failed to create LogStream instance.");
        }

        let process_elapsed = process_start_time.elapsed();
        println!("[Receiver] Logs processed. Total time: {:.2?}", process_elapsed);
    }
}


// --------------------------------------end of 2---------------------------------------------