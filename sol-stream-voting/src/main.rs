#[macro_use]
extern crate diesel;

mod models;
mod routes;
mod schema;
mod solana;
use rocket::routes;
use solana::subscribe_to_programlogs;
use solana::subscribe_to_programlogs2;
use solana::process_logs;
use crate::routes::index;

use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

use rocket::config;

// use bb8::Pool;
// use bb8_diesel::DieselConnectionManager;
// use diesel::pg::PgConnection;

use std::sync::Arc;
// use borsh::maybestd::sync::Arc;
use rocket::tokio;

// type DbPool = Pool<DieselConnectionManager<PgConnection>>;

// fn establish_connection_pool() -> DbPool {
//     dotenv().ok();
//     let manager = DieselConnectionManager::<PgConnection>::new(
//         env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
//     );
//     Pool::builder()
//         .build(manager)
//         .expect("Failed to create database connection pool")
// }

use diesel::r2d2::{ConnectionManager, Pool};
use diesel::pg::PgConnection;

type DbPool = Pool<ConnectionManager<PgConnection>>;

fn establish_connection_pool() -> DbPool {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    Pool::builder()
        .build(manager)
        .expect("Failed to create database connection pool")
}


pub fn establish_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

#[rocket::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // get_accounts_and_update();
    
    // subscribe_to_programlogs();


    // -------------------------------2----------------------------------

    let program_ids = vec!["FHMLXhyqhWVUdZB3VUHtKfTkaFwTSj5zexMdNb8r3sKW".to_string(), 
    "7RXoiLFXMpXsAcWmgL877y54V8TtkSGorSA6wjv2gy8w".to_string()
    ];
    let db_pool = Arc::new(establish_connection_pool()); // Replace with your connection pool

    for program_id in program_ids {
        // Create a channel for communication between subscription and processor
        // let (tx, rx) = mpsc::channel();
        let (tx, rx): (tokio::sync::mpsc::Sender<Vec<String>>, tokio::sync::mpsc::Receiver<Vec<String>>) = tokio::sync::mpsc::channel(100);


        // Spawn the subscription task
        let program_id_clone = program_id.clone();
        tokio::spawn(subscribe_to_programlogs2(program_id_clone, tx));

        // Spawn the processor task
        let db_pool_clone = Arc::clone(&db_pool);
        tokio::spawn(process_logs(rx, db_pool_clone));
    }

    // // Keep the main function running
    // loop {
    //     tokio::time::sleep(tokio::time::Duration::from_secs(60)).await;
    // }

    // -------------------------------end of 2-----------------------------------

    let cors = rocket_cors::CorsOptions::default().to_cors()?;


    // rocket::build()
    //     .mount("/", routes![index])
    //     .attach(cors)
    //     .launch()
    //     .await?;

        // Build a Rocket instance with a custom port
        let config = rocket::Config {
            port: 8084, // Set your desired port here
            ..rocket::Config::default()
        };
    
        rocket::custom(config)
            .mount("/", routes![index])
            .attach(cors)
            .launch()
            .await?;


    Ok(())
}
