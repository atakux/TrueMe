import axios from 'axios';

async function fetchAmazonProductData(keyword) {
  const options = {
    method: 'GET',
    url: 'https://amazon-product-data6.p.rapidapi.com/product-by-text',
    params: {
      keyword: keyword,
      page: '1',
      country: 'US'
    },
    headers: {
      'X-RapidAPI-Host': 'amazon-product-data6.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default fetchAmazonProductData;
