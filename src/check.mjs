import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const domain = process.env.HOST;
const urls = [];

async function walker(url, parent) {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const contentType = await response.headers.get("content-type");
      if (!contentType.startsWith("text/html")) {
        console.info(`NOT HTML: ${url}`);
      } else {
        const body = await response.text();
        const dom = new JSDOM(body);
        const elements = dom.window.document.querySelectorAll("body a[href]");

        elements.forEach((element) => {
          const href = element.getAttribute("href");

          if (urls.indexOf(href) > -1) {
            console.info(`Existing: ${href}`);
            return;
          }

          if (href.startsWith("#") || href.startsWith("mailto:")) {
            console.info(`Ignore: ${href}`);
            return;
          }

          urls.push(href);

          if (href.startsWith("https://") || href.startsWith("http://")) {
            console.info(`External: ${href}`);
          } else {
            console.info(`internal: ${domain}${href}`);
            walker(`${domain}${href}`, url);
          }
        });
      }
    } else {
      console.error(`404: ${url}, parent: ${parent}`);
    }
  } catch (error) {
    console.error(error);
  }
}

walker(domain);
