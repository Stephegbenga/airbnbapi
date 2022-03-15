const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const express = require('express');
const { urlToHttpOptions } = require('url');
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const PORT = 8080 || process.env.PORT
const email = process.env.EMAIL
const password = process.env.PASSWORD
const prompt = require('prompt-sync')();

console.log(email)
console.log(password)


app.get('/', async (req, res) => {
  res.send("Airbnb Api")
})



app.get('/listing', async (req, res) => {
  res.send("Will be Updated Soon")
  id = req.query.id;
  price = req.query.price;
  date = req.query.date;
  console.log(id, date, price)


  puppeteerExtra.use(stealthPlugin());
  const browser = await puppeteer.launch({  slowMo: 250, headless: false, args: ['--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote', // <- this one doesn't works in Windows
  '--disable-gpu'], userDataDir: 'airbnbsession'})
  const page = await browser.newPage()
  await page.goto(`https://www.airbnb.com/multicalendar/${id}/${date}/${date}/edit`)
  const url = await page.url(); 
  console.log(url)
  if(url.includes('multicalendar')){
    console.log("At the right page")
  }else{
    console.log("Not Authorized")
  }
  await page.waitForTimeout(30000);
  await page.waitForSelector('[class="_1mq95mh2"')
  await page.click('[class="_1mq95mh2"');

  await page.waitForTimeout(10000);
  
  await page.waitForSelector('#HOST_CALENDAR_EDITPANEL_NIGHTLY_PRICE_INPUT-input')
  await page.click('#HOST_CALENDAR_EDITPANEL_NIGHTLY_PRICE_INPUT-input', {clickCount: 3});
await page.keyboard.press('Backspace');

await page.waitForTimeout(1000);
await page.type('#HOST_CALENDAR_EDITPANEL_NIGHTLY_PRICE_INPUT-input', price)

await page.waitForSelector('[class="_1bypv0kk"')
await page.click('[class="_1bypv0kk"');

console.log("done")
await page.waitForTimeout(5000);
await browser.close();

  
})




app.get('/authorize', async (req, res) => {
  res.send('Authorization in progress check the console for more details')
  
// (async () => {
  puppeteerExtra.use(stealthPlugin());
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--single-process', // <- this one doesn't works in Windows
  '--disable-gpu',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-pings',
  '--no-sandbox',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain'], userDataDir: 'airbnbsession'})
  const page = await browser.newPage()
  await page.goto('https://www.airbnb.com/login')
  await page.waitForTimeout(10000);
  await page.waitForSelector('[class="_2f9tmt0"').catch((err) => {return})
  await page.click('[class="_2f9tmt0"').catch((err) => {return})
  await page.waitForSelector('[aria-label="Continue with email"');
   await page.waitForTimeout(10000);
  await page.click('[aria-label="Continue with email"')
  console.log("Clicked continue with email")
  await page.waitForTimeout(5000);
  await page.waitForSelector('#email-login-email');
  await page.type('#email-login-email', email)
 //  console.log("Email has been typed")
 //  await page.waitForTimeout(3000);
  await page.waitForSelector('[class="_m9v25n"');
  await page.click('[class="_m9v25n"')
 //  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'pass.png' })
 // await page.waitForTimeout(5000);
  await page.waitForSelector('#email-signup-password');
  await page.type('#email-signup-password', password)
 // await page.waitForTimeout(5000);
  console.log("Password has been typed")
  await page.waitForSelector('[class="_m9v25n"');
  await page.click('[class="_m9v25n"')
  await page.waitForTimeout(5000);
  await page.waitForSelector('[class="_17h5p1f"').catch((err) => {return})
  await page.click('[class="_17h5p1f"').catch((err) => {return})
  await page.waitForSelector('[class="_d0z9t8r"').catch((err) => {return})
  await page.click('[class="_d0z9t8r"').catch((err) => {return})
 
  const code  = prompt('Enter the code sent to your mobile');
  console.log(`${code} received`);
 
  await page.type('#codeinput_0', code)
 
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'final.png' })
  
 console.log("done")
 // await browser.close();
//  })()
})



  app.listen(PORT, () => {
    console.log(`app is listening on port :${PORT}`)
  })