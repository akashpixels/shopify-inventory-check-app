# Shopify Inventory Check App

A private Shopify app to return real-time inventory based on customer location.

## How it works

Frontend makes a request like:

GET /check-stock?variant_id=VARIANT_ID&country=IN

This app:
- Uses Shopify Admin API
- Fetches the inventory_item_id
- Checks inventory level at specified warehouse (India or USA)
- Returns available stock

## To Deploy

1. Copy .env.example to .env
2. Fill in your Shopify API Token and Location IDs
3. Deploy to Vercel, Railway, or Render
