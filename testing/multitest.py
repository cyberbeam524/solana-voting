import subprocess
import random
import threading
import time

# Define the directories
directories = ["/mnt/c/Users/Maaruni/Documents/GitHub/solana-voting/program2", "/mnt/c/Users/Maaruni/Documents/GitHub/solana-voting/kinobi-test"]

# Number of iterations
num_iterations = 100

# Function to run a test in a directory
def run_test(directory):
    try:
        start_time = time.time()
        print(f"Running test in {directory}")
        result = subprocess.run(["anchor", "run", "test1"], cwd=directory, capture_output=True, text=True)
        end_time = time.time()
        
        if result.returncode == 0:
            print(f"Test completed successfully in {directory}. Time taken: {end_time - start_time:.2f}s")
        else:
            print(f"Test failed in {directory}. Error: {result.stderr}")
    except Exception as e:
        print(f"Error while running test in {directory}: {e}")

# Function to perform multithreaded testing for one iteration
def run_iteration():
    # Randomly shuffle the directories
    random.shuffle(directories)

    # Create threads for concurrent execution
    threads = [
        threading.Thread(target=run_test, args=(directories[0],)),
        threading.Thread(target=run_test, args=(directories[1],))
    ]

    # Start threads
    for thread in threads:
        thread.start()

    # Wait for threads to finish
    for thread in threads:
        thread.join()

# Perform multiple iterations
start_time = time.time()
for i in range(num_iterations):
    print(f"\nStarting iteration {i + 1}/{num_iterations}")
    run_iteration()
end_time = time.time()

# Print summary
print(f"\nCompleted {num_iterations} iterations.")
print(f"Total time taken: {end_time - start_time:.2f}s")
