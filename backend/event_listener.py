import time
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"))

contract_address = w3.toChecksumAddress("0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47")

abi = [
   # Put your smart contract ABI json here
]

contract = w3.eth.contract(address=contract_address, abi=abi)

def handle_event(event):
    print("Event: ", event)
    # Add database storage logic here

def log_loop(event_filter, poll_interval):
    while True:
        for event in event_filter.get_new_entries():
            handle_event(event)
        time.sleep(poll_interval)

def main():
    event_filter = contract.events.ConsentGiven.createFilter(fromBlock='latest')
    log_loop(event_filter, 2)

if __name__ == "__main__":
    main()
