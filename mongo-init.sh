#!/bin/bash
mongosh <<EOF
// Initialize the replica set
rs.initiate({
    _id: 'rs0',
    members: [
        { _id: 0, host: 'mongodb:27017' }
    ]
});

// initialize the db user
db = db.getSiblingDB("$DB_NAME");
db.createUser({
  user: "$DB_USER",
  pwd: "$DB_PASS",
  roles: [{
    role: "readWrite",
    db: "$DB_NAME"
  }]
})
EOF