import subprocess
import threading
import re
import time
from statistics import mean

# Directories for the two programs
directories = [
    "/mnt/c/Users/Maaruni/Documents/GitHub/solana-voting/program2",
    "/mnt/c/Users/Maaruni/Documents/GitHub/solana-voting/kinobi-test",
]

streamingDir = "/mnt/c/Users/Maaruni/Documents/GitHub/solana-voting/sol-stream-voting"

# Metrics storage
streamer_times = []
receiver_times = []
db_write_times = []

# Regex patterns for extracting metrics
STREAMER_PATTERN = r"Streamer.*Time taken: ([\d.]+)s"
RECEIVER_PATTERN = r"Receiver.*Total time: ([\d.]+)s"
DB_WRITE_PATTERN = r"Logs written to DB.*Time taken: ([\d.]+)s"

# Function to monitor the streamer's output
def monitor_streamer(directory):
    try:
        print("Starting streamer...")
        # Start the streamer process
        streamer_process = subprocess.Popen(
            
            ["cargo", "run"],  # Update this to the correct command for the streamer
            cwd=directory,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )

        # Read output line by line
        for line in iter(streamer_process.stdout.readline, ""):
            print(f"[Streamer] {line.strip()}")
            # Parse metrics from the streamer's output
            if match := re.search(STREAMER_PATTERN, line):
                streamer_times.append(float(match.group(1)))
            if match := re.search(RECEIVER_PATTERN, line):
                receiver_times.append(float(match.group(1)))
            if match := re.search(DB_WRITE_PATTERN, line):
                db_write_times.append(float(match.group(1)))

        # Wait for the process to finish
        streamer_process.wait()
    except Exception as e:
        print(f"Error monitoring streamer: {e}")

# Function to run `anchor run test1` in a specific directory
def run_anchor_test(directory):
    try:
        print(f"Starting `anchor run test1` in {directory}...")
        result = subprocess.run(
            ["anchor", "run", "test1"],
            cwd=directory,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        if result.returncode == 0:
            print(f"`anchor run test1` completed successfully in {directory}")
        else:
            print(f"`anchor run test1` failed in {directory}. Error: {result.stdout}")
    except Exception as e:
        print(f"Error running `anchor run test1` in {directory}: {e}")

# Main function
def main():
    # Start monitoring the streamer in a separate thread
    streamer_thread = threading.Thread(target=monitor_streamer, args=(streamingDir,), daemon=True)
    streamer_thread.start()

    # # Start the two `anchor run test1` programs concurrently
    # test_threads = [
    #     threading.Thread(target=run_anchor_test, args=(dir_,)) for dir_ in directories
    # ]
    # for thread in test_threads:
    #     thread.start()

    # # Wait for both `anchor run test1` programs to finish
    # for thread in test_threads:
    #     thread.join()

    num_iterations = 3
    for iteration in range(num_iterations):
        print(f"\nStarting iteration {iteration + 1}/{num_iterations}")

        # Start the two `anchor run test1` programs concurrently
        test_threads = [
            threading.Thread(target=run_anchor_test, args=(dir_,)) for dir_ in directories
        ]
        for thread in test_threads:
            thread.start()

        # Wait for both `anchor run test1` programs to finish
        for thread in test_threads:
            thread.join()

    # Allow the streamer to finish (if it's not continuous)
    streamer_thread.join(timeout=5)

    # Summarize metrics
    print("\nPerformance Metrics Summary:")
    if streamer_times:
        print(f"Streamer average time: {mean(streamer_times):.2f}s")
        print(f"Streamer max time: {max(streamer_times):.2f}s")
    if receiver_times:
        print(f"Receiver average time: {mean(receiver_times):.2f}s")
        print(f"Receiver max time: {max(receiver_times):.2f}s")
    if db_write_times:
        print(f"DB write average time: {mean(db_write_times):.2f}s")
        print(f"DB write max time: {max(db_write_times):.2f}s")

if __name__ == "__main__":
    main()
