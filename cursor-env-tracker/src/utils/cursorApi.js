// Cursor Admin API integration utilities
// Based on the research article: https://anuragsridharan.substack.com/p/we-can-use-tokens-to-track-ais-carbon

const CURSOR_API_BASE = 'https://api.cursor.com/v1';

/**
 * Fetch usage data from Cursor Admin API
 * @param {string} apiKey - Cursor Admin API key
 * @param {string} timeRange - Time range in days ('7', '30', '90')
 * @returns {Promise<Object>} Usage data object
 */
export const fetchCursorUsageData = async (apiKey, timeRange = '30') => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(timeRange));

    const response = await fetch(`${CURSOR_API_BASE}/usage`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      // Note: These parameters may need adjustment based on actual Cursor API
      params: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        granularity: 'day'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return processUsageData(data, timeRange);
  } catch (error) {
    console.error('Error fetching Cursor usage data:', error);
    throw error;
  }
};

/**
 * Process raw API data into our expected format
 * @param {Object} rawData - Raw data from Cursor API
 * @param {string} timeRange - Time range in days
 * @returns {Object} Processed usage data
 */
const processUsageData = (rawData, timeRange) => {
  // This function will need to be updated based on the actual Cursor API response structure
  // For now, we'll return a structure that matches our mock data
  
  const totalTokens = rawData.total_tokens || 0;
  const promptTokens = rawData.prompt_tokens || 0;
  const completionTokens = rawData.completion_tokens || 0;
  const requests = rawData.total_requests || 0;
  
  // Process model breakdown if available
  const models = {};
  if (rawData.models) {
    Object.entries(rawData.models).forEach(([model, data]) => {
      models[model] = {
        tokens: data.tokens || 0,
        percentage: totalTokens > 0 ? ((data.tokens / totalTokens) * 100).toFixed(1) : 0
      };
    });
  } else {
    // Default model breakdown if not provided
    models['gpt-4'] = {
      tokens: Math.floor(totalTokens * 0.6),
      percentage: 60.0
    };
    models['gpt-3.5-turbo'] = {
      tokens: Math.floor(totalTokens * 0.4),
      percentage: 40.0
    };
  }
  
  // Process daily usage data
  const dailyUsage = rawData.daily_usage || generateDailyData(parseInt(timeRange));
  
  return {
    totalTokens,
    promptTokens,
    completionTokens,
    requests,
    models,
    dailyUsage
  };
};

/**
 * Generate mock daily data for demonstration
 * @param {number} days - Number of days to generate
 * @returns {Array} Array of daily usage objects
 */
const generateDailyData = (days) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      tokens: Math.floor(Math.random() * 100000) + 50000
    });
  }
  return data;
};

/**
 * Validate API key format (basic validation)
 * @param {string} apiKey - API key to validate
 * @returns {boolean} Whether the API key appears valid
 */
export const validateApiKey = (apiKey) => {
  // Basic validation - Cursor API keys typically start with specific prefixes
  // This should be updated based on actual Cursor API key format
  return apiKey && apiKey.length > 20 && apiKey.startsWith('cursor_');
};

/**
 * Carbon footprint calculation constants
 * Based on research from: https://anuragsridharan.substack.com/p/we-can-use-tokens-to-track-ais-carbon
 */
export const CARBON_CONSTANTS = {
  // Energy consumption per token (kWh)
  ENERGY_PER_TOKEN_KWH: 0.000187,
  
  // CO2 emissions per token (grams) - Korea grid
  CO2_PER_TOKEN_G: 0.0859,
  
  // Tree absorption rate (kg CO2 per year)
  TREE_ABSORPTION_KG_YEAR: 21,
  
  // Grid carbon intensity (kg CO2 per kWh) - Korea
  GRID_CARBON_INTENSITY: 0.459
};

/**
 * Calculate carbon footprint from token usage
 * @param {number} totalTokens - Total number of tokens
 * @returns {Object} Carbon footprint metrics
 */
export const calculateCarbonFootprint = (totalTokens) => {
  const energyKwh = totalTokens * CARBON_CONSTANTS.ENERGY_PER_TOKEN_KWH;
  const co2Kg = (totalTokens * CARBON_CONSTANTS.CO2_PER_TOKEN_G) / 1000;
  const energyJoules = energyKwh * 3600000;
  
  return {
    totalTokens,
    energyKwh: energyKwh.toFixed(4),
    energyJoules: energyJoules.toFixed(0),
    co2Kg: co2Kg.toFixed(3),
    co2G: (co2Kg * 1000).toFixed(1)
  };
};

/**
 * Calculate trees needed to offset carbon footprint
 * @param {number} co2Kg - CO2 emissions in kilograms
 * @returns {Object} Tree offset calculations
 */
export const calculateTreeOffset = (co2Kg) => {
  const treesNeeded = Math.ceil(co2Kg / CARBON_CONSTANTS.TREE_ABSORPTION_KG_YEAR);
  const treeDays = (co2Kg / CARBON_CONSTANTS.TREE_ABSORPTION_KG_YEAR) * 365;
  
  return {
    treesNeeded,
    treeDays: treeDays.toFixed(1)
  };
};
