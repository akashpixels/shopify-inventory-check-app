const axios = require('axios');

module.exports = async (req, res) => {
  const { variant_id, country } = req.query;

  if (!variant_id || !country) {
    return res.status(400).json({ error: 'Missing variant_id or country' });
  }

  try {
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const shop = process.env.SHOP;
    const indiaLocation = process.env.INDIA_LOCATION_ID;
    const usaLocation = process.env.USA_LOCATION_ID;

    const locationId = country === 'IN' ? indiaLocation : usaLocation;

    // Step 1: Get the variant's inventory_item_id
    const variantRes = await axios.get(`https://${shop}/admin/api/2023-10/variants/${variant_id}.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    const inventoryItemId = variantRes.data.variant.inventory_item_id;

    // Step 2: Fetch inventory for that inventory_item_id at the correct location
    const inventoryRes = await axios.get(`https://${shop}/admin/api/2023-10/inventory_levels.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      },
      params: {
        inventory_item_ids: inventoryItemId,
        location_ids: locationId
      }
    });

    const available = inventoryRes.data.inventory_levels[0]?.available || 0;
    res.status(200).json({ available });

  } catch (err) {
    console.error("SHOPIFY ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
};
