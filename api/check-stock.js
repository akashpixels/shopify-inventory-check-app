const axios = require('axios');

module.exports = async (req, res) => {
  // 🔒 Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // <-- Or use your domain: 'https://www.kartikresearch.com'
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 🔄 Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { variant_id, country } = req.query;

  if (!variant_id || !country) {
    return res.status(400).json({ error: 'Missing variant_id or country' });
  }

  try {
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const shop = process.env.SHOP;
    const indiaLocation = process.env.INDIA_LOCATION_ID;
    const usaLocation = process.env.USA_LOCATION_ID;

    // 1. Get variant to find inventory_item_id
    const variantRes = await axios.get(`https://${shop}/admin/api/2023-10/variants/${variant_id}.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken
      }
    });

    const inventoryItemId = variantRes.data.variant.inventory_item_id;

    // 2. Get inventory level for specified location
    const locationId = country === 'IN' ? indiaLocation : usaLocation;

    const inventoryRes = await axios.get(`https://${shop}/admin/api/2023-10/inventory_levels.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken
      },
      params: {
        inventory_item_ids: inventoryItemId,
        location_ids: locationId
      }
    });

    const level = inventoryRes.data.inventory_levels[0]?.available || 0;

    return res.status(200).json({ available: level });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
};
