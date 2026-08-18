#!/usr/bin/env bash
# Load-test the public survey page with 200 concurrent requests.
# Safe to Ctrl+C at any time — autocannon aborts in-flight requests and
# exits immediately, it never keeps running unattended.

npx autocannon \
  --connections 200 \
  --amount 200 \
  --timeout 20 \
  https://skyvotee.vercel.app/
