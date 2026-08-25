// Market Prices & Price Trends Intelligence
// Currently using mock data.
// Later, this can be replaced with data from a real market-price API/backend.

export const marketPrices = [
  {
    crop: "Cotton (పత్తి)",
    market: "Khammam Market Yard",
    minPrice: 7200,
    modalPrice: 7550,
    maxPrice: 7850,
    changePercent: "+2.4%",
    trend: "up",
    unit: "Quintal",
    arrivalQty: "1,450 Quintals",

    advisory:
      "Strong demand from spinners. High possibility of further ₹100-150 increase in the next 4 days.",

    recommendation:
      "Compare nearby buyer offers and sell directly to the best buyer above ₹7,600.",
  },

  {
    crop: "Red Chilli (మిర్చి)",
    market: "Warangal & Khammam",
    minPrice: 17500,
    modalPrice: 19200,
    maxPrice: 20800,
    changePercent: "+4.1%",
    trend: "up",
    unit: "Quintal",
    arrivalQty: "820 Quintals",

    advisory:
      "Export demand for Teja variety is increasing. Grade A lots may receive better prices.",

    recommendation:
      "Compare nearby buyer offers and consider selling directly if the offer is above ₹19,500.",
  },

  {
    crop: "Paddy (వరి - BPT)",
    market: "Miryalaguda & Suryapet",
    minPrice: 2280,
    modalPrice: 2380,
    maxPrice: 2450,
    changePercent: "-0.8%",
    trend: "down",
    unit: "Quintal",
    arrivalQty: "4,200 Quintals",

    advisory:
      "High arrivals are putting pressure on prices. Prices are expected to remain around ₹2,350-2,400.",

    recommendation:
      "Compare nearby rice millers and buyers before accepting an offer.",
  },

  {
    crop: "Turmeric (పసుపు)",
    market: "Nizamabad & Sangli",
    minPrice: 13800,
    modalPrice: 14600,
    maxPrice: 15200,
    changePercent: "+1.8%",
    trend: "up",
    unit: "Quintal",
    arrivalQty: "340 Quintals",

    advisory:
      "Demand for high-curcumin turmeric is supporting premium prices.",

    recommendation:
      "Check nearby buyer offers and prefer buyers offering a premium for quality produce.",
  },

  {
    crop: "Maize / Corn (మొక్కజొన్న)",
    market: "Badepalli / Mahbubnagar",
    minPrice: 2150,
    modalPrice: 2280,
    maxPrice: 2360,
    changePercent: "+0.5%",
    trend: "neutral",
    unit: "Quintal",
    arrivalQty: "2,100 Quintals",

    advisory:
      "Poultry feed demand is steady and prices are currently stable.",

    recommendation:
      "Compare direct poultry-feed buyers and local traders before selling.",
  },
];

/*
 * Seven-day market price history.
 *
 * Each crop has its own price history so that the chart/table
 * changes correctly when the farmer selects a different crop.
 */
export const priceHistory7Days = [
  {
    crop: "Cotton",
    prices: [
      { day: "18 Aug", price: 7350 },
      { day: "19 Aug", price: 7400 },
      { day: "20 Aug", price: 7420 },
      { day: "21 Aug", price: 7480 },
      { day: "22 Aug", price: 7500 },
      { day: "23 Aug", price: 7520 },
      { day: "Today", price: 7550 },
    ],
  },

  {
    crop: "Red Chilli",
    prices: [
      { day: "18 Aug", price: 18400 },
      { day: "19 Aug", price: 18600 },
      { day: "20 Aug", price: 18800 },
      { day: "21 Aug", price: 18900 },
      { day: "22 Aug", price: 19050 },
      { day: "23 Aug", price: 19100 },
      { day: "Today", price: 19200 },
    ],
  },

  {
    crop: "Paddy",
    prices: [
      { day: "18 Aug", price: 2400 },
      { day: "19 Aug", price: 2390 },
      { day: "20 Aug", price: 2380 },
      { day: "21 Aug", price: 2380 },
      { day: "22 Aug", price: 2370 },
      { day: "23 Aug", price: 2380 },
      { day: "Today", price: 2380 },
    ],
  },

  {
    crop: "Turmeric",
    prices: [
      { day: "18 Aug", price: 14100 },
      { day: "19 Aug", price: 14250 },
      { day: "20 Aug", price: 14300 },
      { day: "21 Aug", price: 14400 },
      { day: "22 Aug", price: 14500 },
      { day: "23 Aug", price: 14550 },
      { day: "Today", price: 14600 },
    ],
  },

  {
    crop: "Maize",
    prices: [
      { day: "18 Aug", price: 2250 },
      { day: "19 Aug", price: 2260 },
      { day: "20 Aug", price: 2265 },
      { day: "21 Aug", price: 2270 },
      { day: "22 Aug", price: 2275 },
      { day: "23 Aug", price: 2280 },
      { day: "Today", price: 2280 },
    ],
  },
];
// Backward compatibility for existing components
export const liveMandiRates = marketPrices;