use rocket::get;
// use rocket::response::content::Json;
use rocket::serde::json::Json;
use rocket::serde::json::serde_json::json;
use rocket::serde::json::Value;
use std::str::FromStr;

use crate::establish_connection;
use crate::{solana::subscribe_to_programlogs};
// use crate::models::Stream;

#[get("/")]
pub fn index() -> &'static str 
{
    println!("Accessing program logs now....");
    // subscribe_to_programlogs();
    "Accessing program logs now...."
}