const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

// Initialize Web3
const web3 = new Web3(process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:7545');

// Load contract ABI and address
let contractABI, contractAddress;

try {
    const contractInfo = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../contracts/contractInfo.json'), 'utf8')
    );
    contractABI = contractInfo.abi;
    contractAddress = contractInfo.address;
} catch (error) {
    console.warn('Contract info not found. Please deploy the contract first.');
    contractABI = [];
    contractAddress = process.env.CONTRACT_ADDRESS || '';
}

// Create contract instance
const contract = contractAddress ? new web3.eth.Contract(contractABI, contractAddress) : null;

// Blockchain utility functions
const blockchainUtils = {
    // Get Web3 instance
    getWeb3: () => web3,
    
    // Get contract instance
    getContract: () => contract,
    
    // Register tourist on blockchain
    registerTourist: async (walletAddress, name, email, phoneNumber, privateKey) => {
        try {
            const accounts = await web3.eth.getAccounts();
            
            // Fund the tourist wallet with some ETH from Ganache account[0]
            console.log('   Funding wallet with 1 ETH...');
            await web3.eth.sendTransaction({
                from: accounts[0],
                to: walletAddress,
                value: web3.utils.toWei('1', 'ether'),
                gas: 21000
            });
            console.log('   Wallet funded successfully');
            
            // Add account to web3 using private key
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(account);
            
            // Register tourist using their own wallet
            console.log('   Calling registerTourist on smart contract...');
            const result = await contract.methods
                .registerTourist(name, email, phoneNumber)
                .send({ from: walletAddress, gas: 500000 });
            
            console.log('   Registration TX Hash:', result.transactionHash);
            return result;
        } catch (error) {
            console.error('Blockchain registration error:', error);
            throw error;
        }
    },
    
    // Report incident on blockchain
    reportIncident: async (touristAddress, incidentType, location, description) => {
        try {
            const accounts = await web3.eth.getAccounts();
            const result = await contract.methods
                .reportIncident(touristAddress, incidentType, location, description)
                .send({ from: accounts[0], gas: 500000 });
            
            console.log('Incident reported on blockchain:', result.transactionHash);
            return result;
        } catch (error) {
            console.error('Blockchain incident report error:', error);
            throw error;
        }
    },
    
    // Get tourist from blockchain
    getTourist: async (walletAddress) => {
        try {
            const tourist = await contract.methods.getTourist(walletAddress).call();
            return {
                name: tourist[0],
                email: tourist[1],
                phoneNumber: tourist[2],
                registrationTime: tourist[3],
                isActive: tourist[4]
            };
        } catch (error) {
            console.error('Error fetching tourist from blockchain:', error);
            throw error;
        }
    },
    
    // Get incident from blockchain
    getIncident: async (incidentId) => {
        try {
            const incident = await contract.methods.getIncident(incidentId).call();
            return {
                touristAddress: incident[0],
                incidentType: incident[1],
                location: incident[2],
                timestamp: incident[3],
                description: incident[4],
                resolved: incident[5]
            };
        } catch (error) {
            console.error('Error fetching incident from blockchain:', error);
            throw error;
        }
    },
    
    // Resolve incident
    resolveIncident: async (incidentId) => {
        try {
            const accounts = await web3.eth.getAccounts();
            const result = await contract.methods
                .resolveIncident(incidentId)
                .send({ from: accounts[0], gas: 300000 });
            
            console.log('Incident resolved on blockchain:', result.transactionHash);
            return result;
        } catch (error) {
            console.error('Error resolving incident:', error);
            throw error;
        }
    },
    
    // Create new wallet
    createWallet: () => {
        const account = web3.eth.accounts.create();
        return {
            address: account.address,
            privateKey: account.privateKey
        };
    }
};

module.exports = blockchainUtils;
