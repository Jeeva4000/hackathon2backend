// //'mongodb+srv://Jeevav:Jeeva12@cluster0.myzy7hq.mongodb.net/?retryWrites=true&w=majority'


import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import mongoose from "mongoose";

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://Jeevav:Jeeva12@cluster0.myzy7hq.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define a schema for scraped data
const productSchema = new mongoose.Schema({
  title: String,
  price: String,
  website: String,
});

const Product = mongoose.model('Product', productSchema);

// Scrape Flipkart
app.get('/scrape/flipkart', async (req, res) => {
  try {
    const response = await axios.get('https://www.flipkart.com/mobiles/pr?sid=tyy%2C4io&sort=popularity');
    const $ = cheerio.load(response.data);
    const products = [];

    $('._1AtVbE').each((index, element) => {
      const title = $(element).find('a').text();
      const price = $(element).find('div > a > div > div > div._30jeq3._1_WHN1').text();

      products.push({
        title,
        price,
        website: 'Flipkart',
      });
    });

    await Product.insertMany(products);
    res.json({ message: 'Scraped Flipkart data saved to MongoDB' });
  } catch (error) {
    console.error('Error scraping Flipkart:', error);
    res.status(500).json({ error: 'Failed to scrape Flipkart' });
  }
});

// Scrape Amazon
app.get('/scrape/amazon', async (req, res) => {
  try {
    const response = await axios.get('https://www.amazon.com/Google-Pixel-7a-Unlocked-Smartphone/dp/B0BZ9T8R41/ref=sr_1_1_sspa?crid=2L8G9DB03FZ61&keywords=mobiles+5g&qid=1687961964&sprefix=mobiles%2Caps%2C1849&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1');
    const $ = cheerio.load(response.data);
    const products = [];

    $('.s-result-item').each((index, element) => {
      const title = $(element).find('h2').text().trim();
      const price = $(element).find('.a-offscreen').text();

      products.push({
        title,
        price,
        website: 'Amazon',
      });
    });

    await Product.insertMany(products);
    res.json({ message: 'Scraped Amazon data saved to MongoDB' });
  } catch (error) {
    console.error('Error scraping Amazon:', error);
    res.status(500).json({ error: 'Failed to scrape Amazon' });
  }
});

// Scrape Snapdeal
app.get('/scrape/snapdeal', async (req, res) => {
  try {
    const response = await axios.get('https://www.snapdeal.com/search?keyword=mobiles&santizedKeyword=mobiles&catId=0&categoryId=0&suggested=false&vertical=p&noOfResults=20&searchState=categoryNavigation&clickSrc=go_header&lastKeyword=&prodCatId=&changeBackToAll=false&foundInAll=false&categoryIdSearched=&cityPageUrl=&categoryUrl=&url=&utmContent=&dealDetail=&sort=rlvncy');
    const $ = cheerio.load(response.data);
    const products = [];

    $('.product-tuple-description').each((index, element) => {
      const title = $(element).find('.product-title').text();
      const price = $(element).find('.product-price').text();

      products.push({
        title,
        price,
        website: 'Snapdeal',
      });
    });

    await Product.insertMany(products);
    res.json({ message: 'Scraped Snapdeal data saved to MongoDB' });
  } catch (error) {
    console.error('Error scraping Snapdeal:', error);
    res.status(500).json({ error: 'Failed to scrape Snapdeal' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
