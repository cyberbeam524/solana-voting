import subprocess
import threading
import re
import time
from statistics import mean

# Directories and program IDs
directories = [
    "/mnt/c/Users/Maaruni/Documents/GitHub/solana-voting/program2",
    "/mnt/c/Users/Maaruni/Documents/GitHub/solana-voting/kinobi-test",
]

num_iterations = 100

# Metrics storage
streamer_times = []
receiver_times = []
db_write_times = []

# Parse performance logs
def parse_metrics(output, metric_list, pattern):
    for line in output.splitlines():
        match = re.search(pattern, line)
        if match:
            metric_list.append(float(match.group(1)))

# Run a test
def run_test(directory):
    result = subprocess.run(
        ["anchor", "run", "test1"],
        cwd=directory,
        capture_output=True,
        text=True,
    )
    if result.returncode == 0:
        # Extract and store metrics
        parse_metrics(result.stdout, streamer_times, r"Streamer.*Time taken: ([\d.]+)s")
        parse_metrics(result.stdout, receiver_times, r"Receiver.*Total time: ([\d.]+)s")
        parse_metrics(result.stdout, db_write_times, r"Logs written to DB.*Time taken: ([\d.]+)s")
    else:
        print(f"Test failed in {directory}. Error: {result.stderr}")

# Perform multithreaded tests
def run_iteration():
    threads = [threading.Thread(target=run_test, args=(directory,)) for directory in directories]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()

# Main test loop
start_time = time.time()
for i in range(num_iterations):
    print(f"Starting iteration {i + 1}/{num_iterations}")
    run_iteration()
end_time = time.time()

# Summarize results
print(f"\nCompleted {num_iterations} iterations.")
print(f"Total test time: {end_time - start_time:.2f}s")
print(f"Streamer average time: {mean(streamer_times):.2f}s")
print(f"Receiver average time: {mean(receiver_times):.2f}s")
print(f"DB write average time: {mean(db_write_times):.2f}s")
print(f"Max streamer time: {max(streamer_times):.2f}s")
print(f"Max receiver time: {max(receiver_times):.2f}s")
print(f"Max DB write time: {max(db_write_times):.2f}s")
