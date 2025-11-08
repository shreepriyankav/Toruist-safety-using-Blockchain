// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BeaconIncident {
    struct Beacon {
        string beaconId;
        string location;
        uint256 latitude;
        uint256 longitude;
        bool isActive;
        uint256 registeredAt;
    }
    
    struct Incident {
        uint256 incidentId;
        string beaconId;
        uint256 timestamp;
        uint256 latitude;
        uint256 longitude;
        string incidentType; // "MOTION_DETECTED", "GEOFENCE_BREACH"
        bool sirenActivated;
        bool resolved;
        uint256 resolvedAt;
        string evidenceHash; // IPFS hash for photos/logs
    }
    
    mapping(string => Beacon) public beacons;
    mapping(uint256 => Incident) public incidents;
    mapping(string => uint256[]) public beaconIncidents;
    
    uint256 public incidentCounter = 0;
    string[] public beaconIds;
    
    event BeaconRegistered(string beaconId, string location, uint256 timestamp);
    event IncidentRecorded(uint256 incidentId, string beaconId, uint256 timestamp);
    event IncidentResolved(uint256 incidentId, uint256 resolvedAt);
    
    function registerBeacon(
        string memory _beaconId,
        string memory _location,
        uint256 _latitude,
        uint256 _longitude
    ) public {
        require(beacons[_beaconId].registeredAt == 0, "Beacon already registered");
        
        beacons[_beaconId] = Beacon({
            beaconId: _beaconId,
            location: _location,
            latitude: _latitude,
            longitude: _longitude,
            isActive: true,
            registeredAt: block.timestamp
        });
        
        beaconIds.push(_beaconId);
        emit BeaconRegistered(_beaconId, _location, block.timestamp);
    }
    
    function recordIncident(
        string memory _beaconId,
        uint256 _latitude,
        uint256 _longitude,
        string memory _incidentType,
        bool _sirenActivated,
        string memory _evidenceHash
    ) public returns (uint256) {
        require(beacons[_beaconId].isActive, "Beacon not active");
        
        incidentCounter++;
        
        incidents[incidentCounter] = Incident({
            incidentId: incidentCounter,
            beaconId: _beaconId,
            timestamp: block.timestamp,
            latitude: _latitude,
            longitude: _longitude,
            incidentType: _incidentType,
            sirenActivated: _sirenActivated,
            resolved: false,
            resolvedAt: 0,
            evidenceHash: _evidenceHash
        });
        
        beaconIncidents[_beaconId].push(incidentCounter);
        emit IncidentRecorded(incidentCounter, _beaconId, block.timestamp);
        
        return incidentCounter;
    }
    
    function resolveIncident(uint256 _incidentId) public {
        require(incidents[_incidentId].timestamp > 0, "Incident not found");
        require(!incidents[_incidentId].resolved, "Already resolved");
        
        incidents[_incidentId].resolved = true;
        incidents[_incidentId].resolvedAt = block.timestamp;
        
        emit IncidentResolved(_incidentId, block.timestamp);
    }
    
    function getBeaconIncidents(string memory _beaconId) public view returns (uint256[] memory) {
        return beaconIncidents[_beaconId];
    }
    
    function getAllBeacons() public view returns (string[] memory) {
        return beaconIds;
    }
}
