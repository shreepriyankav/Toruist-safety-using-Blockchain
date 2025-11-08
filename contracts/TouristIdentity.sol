// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TouristIdentity
 * @dev Smart contract for managing tourist digital identities and safety incidents
 */
contract TouristIdentity {
    
    // Tourist structure
    struct Tourist {
        string name;
        string email;
        string phoneNumber;
        uint256 registrationTime;
        bool isActive;
        address walletAddress;
    }
    
    // Incident structure
    struct Incident {
        uint256 incidentId;
        address touristAddress;
        string incidentType; // "geo_fence_breach", "inactivity", "emergency"
        string location; // lat,lng format
        uint256 timestamp;
        string description;
        bool resolved;
    }
    
    // Mappings
    mapping(address => Tourist) public tourists;
    mapping(uint256 => Incident) public incidents;
    mapping(address => uint256[]) public touristIncidents;
    
    // Counters
    uint256 public touristCount;
    uint256 public incidentCount;
    
    // Events
    event TouristRegistered(address indexed touristAddress, string name, uint256 timestamp);
    event IncidentReported(uint256 indexed incidentId, address indexed touristAddress, string incidentType, uint256 timestamp);
    event IncidentResolved(uint256 indexed incidentId, uint256 timestamp);
    
    // Register a new tourist
    function registerTourist(string memory _name, string memory _email, string memory _phoneNumber) public {
        require(bytes(tourists[msg.sender].name).length == 0, "Tourist already registered");
        
        tourists[msg.sender] = Tourist({
            name: _name,
            email: _email,
            phoneNumber: _phoneNumber,
            registrationTime: block.timestamp,
            isActive: true,
            walletAddress: msg.sender
        });
        
        touristCount++;
        emit TouristRegistered(msg.sender, _name, block.timestamp);
    }
    
    // Report an incident
    function reportIncident(
        address _touristAddress,
        string memory _incidentType,
        string memory _location,
        string memory _description
    ) public returns (uint256) {
        require(tourists[_touristAddress].isActive, "Tourist not registered");
        
        incidentCount++;
        
        incidents[incidentCount] = Incident({
            incidentId: incidentCount,
            touristAddress: _touristAddress,
            incidentType: _incidentType,
            location: _location,
            timestamp: block.timestamp,
            description: _description,
            resolved: false
        });
        
        touristIncidents[_touristAddress].push(incidentCount);
        
        emit IncidentReported(incidentCount, _touristAddress, _incidentType, block.timestamp);
        return incidentCount;
    }
    
    // Resolve an incident
    function resolveIncident(uint256 _incidentId) public {
        require(_incidentId > 0 && _incidentId <= incidentCount, "Invalid incident ID");
        require(!incidents[_incidentId].resolved, "Incident already resolved");
        
        incidents[_incidentId].resolved = true;
        emit IncidentResolved(_incidentId, block.timestamp);
    }
    
    // Get tourist details
    function getTourist(address _touristAddress) public view returns (
        string memory name,
        string memory email,
        string memory phoneNumber,
        uint256 registrationTime,
        bool isActive
    ) {
        Tourist memory tourist = tourists[_touristAddress];
        return (
            tourist.name,
            tourist.email,
            tourist.phoneNumber,
            tourist.registrationTime,
            tourist.isActive
        );
    }
    
    // Get incident details
    function getIncident(uint256 _incidentId) public view returns (
        address touristAddress,
        string memory incidentType,
        string memory location,
        uint256 timestamp,
        string memory description,
        bool resolved
    ) {
        Incident memory incident = incidents[_incidentId];
        return (
            incident.touristAddress,
            incident.incidentType,
            incident.location,
            incident.timestamp,
            incident.description,
            incident.resolved
        );
    }
    
    // Get all incidents for a tourist
    function getTouristIncidents(address _touristAddress) public view returns (uint256[] memory) {
        return touristIncidents[_touristAddress];
    }
}
