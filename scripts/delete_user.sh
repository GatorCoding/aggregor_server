#!/bin/bash
curl -X DELETE \
     -H "Content-Type: application/json" \
     -H "X-Aggregor-Token: $1" \
     -d "{\"password\": \"$3\"}" \
     localhost:3000/user/$2
