import axios from 'axios';

export async function fetchAmazonProductData(keyword) {
  const options = {
    method: 'GET',
    url: 'https://amazon-product-data6.p.rapidapi.com/product-by-text',
    params: {
      keyword: keyword,
      page: '1',
      country: 'US'
    },
    headers: {
      'X-RapidAPI-Key': '3098662391msh7f644e04d0b1cfbp19277cjsn521252c9be41',
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

export async function fetchAmazonProductDescriptionByASIN(asin) {
  const options = {
    method: 'GET',
    url: 'https://amazon-product-data6.p.rapidapi.com/product-detail',
    params: {
      asin: asin,
      country: 'US'
    },
    headers: {
      'X-RapidAPI-Key': '3098662391msh7f644e04d0b1cfbp19277cjsn521252c9be41',
      'X-RapidAPI-Host': 'amazon-product-data6.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.description;
  } catch (error) {
    throw error;
  }
}

