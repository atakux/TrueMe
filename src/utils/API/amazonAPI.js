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
      'X-RapidAPI-Key': '4ed872957cmsh5ec1e7af323cf1fp1d01c9jsn800d92e7dc77',
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
