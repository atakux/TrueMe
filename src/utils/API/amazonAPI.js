import axios from 'axios';

// Function to fetch data from Amazon API
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
      'X-RapidAPI-Key': process.env.API_KEY,
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

// export async function fetchAmazonProductDescriptionByASIN(asin) {
//   const options = {
//     method: 'GET',
//     url: 'https://amazon-product-data6.p.rapidapi.com/product-detail',
//     params: {
//       asin: asin,
//       country: 'US'
//     },
//     headers: {
//       'X-RapidAPI-Key': apiKeys['X-RapidAPI-Key'],
//       'X-RapidAPI-Host': 'amazon-product-data6.p.rapidapi.com'
//     }
//   };

//   let retryCount = 0;
//   const maxRetries = 3;
//   const retryDelay = 1000; // 1 second

//   while (retryCount < maxRetries) {
//     try {
//       const response = await axios.request(options);
//       return response.data;
//     } catch (error) {
//       if (error.response && error.response.status === 429) {
//         console.log('Rate limit exceeded. Retrying after delay...');
//         await new Promise(resolve => setTimeout(resolve, retryDelay));
//         console.log(retryCount);
//         retryCount++;
//       } else {
//         throw error;
//       }
//     }
//   }
//   throw new Error('Exceeded maximum number of retries');
// }


