// Deployment script for TouristIdentity smart contract
const { Web3 } = require('web3');
const fs = require('fs');
const solc = require('solc');

// Connect to Ganache (local blockchain)
const web3 = new Web3('http://127.0.0.1:7545');

async function deployContract() {
    try {
        // Read the contract source code
        const contractSource = fs.readFileSync('./TouristIdentity.sol', 'utf8');
        
        // Compile the contract
        const input = {
            language: 'Solidity',
            sources: {
                'TouristIdentity.sol': {
                    content: contractSource
                }
            },
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                },
                evmVersion: 'istanbul',
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode']
                    }
                }
            }
        };
        
        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        const contract = output.contracts['TouristIdentity.sol']['TouristIdentity'];
        const abi = contract.abi;
        const bytecode = contract.evm.bytecode.object;
        
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        console.log('Deploying from account:', accounts[0]);
        
        // Deploy contract
        const TouristContract = new web3.eth.Contract(abi);
        const deployedContract = await TouristContract.deploy({
            data: '0x' + bytecode
        }).send({
            from: accounts[0],
            gas: 6721975,
            gasPrice: '20000000000'
        });
        
        console.log('Contract deployed at:', deployedContract.options.address);
        
        // Save contract address and ABI
        const deploymentInfo = {
            address: deployedContract.options.address,
            abi: abi
        };
        
        fs.writeFileSync('./contractInfo.json', JSON.stringify(deploymentInfo, null, 2));
        console.log('Contract info saved to contractInfo.json');
        
        return deployedContract.options.address;
    } catch (error) {
        console.error('Deployment error:', error);
    }
}

deployContract();
