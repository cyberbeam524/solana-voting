use crate::diesel::ExpressionMethods;
use borsh::{BorshDeserialize, BorshSerialize};
use diesel::{Insertable, PgConnection, QueryDsl, Queryable, RunQueryDsl};
use serde::Serialize;
use solana_sdk::clock::UnixTimestamp;
use solana_sdk::pubkey::Pubkey;
use chrono::Utc;

// use crate::schema::streams;
use crate::schema::logstreams;


#[derive(Queryable, Insertable, Serialize, Debug)]
#[table_name = "logstreams"]
pub struct LogStream {
    pub logs: String,
    pub timestored: i64,
    pub displayed: bool,
   
}

impl LogStream {
    pub fn new(pda_data: Vec<String>) -> Option<Self> {
        let joined = pda_data.join("|||");
        let dt = Utc::now();
        let timestamp: i64 = dt.timestamp();

        Some(LogStream {
            logs: joined,
            timestored: timestamp,
            displayed: false,
        })

    }

    pub fn insert_or_update(stream: LogStream, conn: &PgConnection) -> bool {
        println!("**********************Inserting into database********************************");
            diesel::insert_into(crate::schema::logstreams::table)
                .values(&stream)
                .execute(conn)
                .is_ok()
    }
}
