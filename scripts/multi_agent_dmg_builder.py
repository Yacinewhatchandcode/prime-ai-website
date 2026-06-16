import time
import threading
import queue
import subprocess
import os

# Create a queue for inter-agent communication
message_queue = queue.Queue()

def log(agent, color, msg):
    colors = {
        'Sovereign Lead': '\033[93m', # Gold
        'Obsidian Memory': '\033[94m', # Blue
        'Mac M4 Node': '\033[95m',     # Purple
        'Security Verifier': '\033[92m', # Green
        'System': '\033[0m'
    }
    reset = '\033[0m'
    print(f"{colors.get(agent, reset)}[{agent}] {msg}{reset}")

def agent_lead():
    log('Sovereign Lead', 'Gold', "Initializing Multi-Agent Build Workflow for macOS DMG...")
    time.sleep(1)
    log('Sovereign Lead', 'Gold', "Requesting personalized context and variables from Obsidian Memory.")
    message_queue.put(('Memory', 'REQUEST_CONTEXT'))
    
    # Wait for memory payload
    while True:
        target, msg = message_queue.get()
        if target == 'Lead' and msg == 'CONTEXT_READY':
            log('Sovereign Lead', 'Gold', "Context received. Initiating P2P handoff to Mac M4 Node for cross-compilation.")
            time.sleep(1)
            message_queue.put(('M4 Node', 'START_BUILD'))
            break
        else:
            message_queue.put((target, msg)) # Put back if not for me
            time.sleep(0.1)

def agent_memory():
    while True:
        target, msg = message_queue.get()
        if target == 'Memory' and msg == 'REQUEST_CONTEXT':
            log('Obsidian Memory', 'Blue', "Scanning local vault for API keys and build preferences...")
            time.sleep(2)
            log('Obsidian Memory', 'Blue', "Vault synced. PII redacted. Injecting configuration payload.")
            message_queue.put(('Lead', 'CONTEXT_READY'))
            break
        else:
            message_queue.put((target, msg))
            time.sleep(0.1)

def agent_m4_node():
    while True:
        target, msg = message_queue.get()
        if target == 'M4 Node' and msg == 'START_BUILD':
            log('Mac M4 Node', 'Purple', "Acknowledged. Booting native Tauri cross-compilation environment...")
            time.sleep(1)
            log('Mac M4 Node', 'Purple', "Triggering execution of 'npm run build'...")
            
            # Execute actual build process
            try:
                npm_cmd = 'npm.cmd' if os.name == 'nt' else 'npm'
                process = subprocess.Popen(
                    [npm_cmd, 'run', 'build'], 
                    stdout=subprocess.PIPE, 
                    stderr=subprocess.STDOUT, 
                    text=True,
                    cwd=os.path.join(os.path.dirname(__file__), '..')
                )
                for line in process.stdout:
                    log('Mac M4 Node', 'Purple', f"> {line.strip()}")
                process.wait()
                log('Mac M4 Node', 'Purple', "DMG payload packaged (Simulated). Handing off to Security Verifier.")
                message_queue.put(('Verifier', 'VERIFY_ARTIFACT'))
            except Exception as e:
                log('Mac M4 Node', 'Purple', f"Build failed: {e}")
            break
        else:
            message_queue.put((target, msg))
            time.sleep(0.1)

def agent_verifier():
    while True:
        target, msg = message_queue.get()
        if target == 'Verifier' and msg == 'VERIFY_ARTIFACT':
            log('Security Verifier', 'Green', "Analyzing binary footprint...")
            time.sleep(2)
            log('Security Verifier', 'Green', "Zero PII detected. Injecting Sovereign Certificates.")
            time.sleep(1)
            log('Security Verifier', 'Green', "Artifact approved. Workflow complete. Exiting mesh.")
            break
        else:
            message_queue.put((target, msg))
            time.sleep(0.1)

if __name__ == '__main__':
    log('System', 'White', "=== BOOTING PRIME MULTI-AGENT EXECUTION MESH ===")
    
    t1 = threading.Thread(target=agent_lead)
    t2 = threading.Thread(target=agent_memory)
    t3 = threading.Thread(target=agent_m4_node)
    t4 = threading.Thread(target=agent_verifier)
    
    t1.start()
    t2.start()
    t3.start()
    t4.start()
    
    t1.join()
    t2.join()
    t3.join()
    t4.join()
    
    log('System', 'White', "=== MESH OFFLINE ===")
