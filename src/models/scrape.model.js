import * as cheerio from "cheerio";

const MIN_INTERCOOLER_DIMENSION = 20;

export const getPage = async (url) => {
    let productsOnPage = [];

    const res = await fetch(url); 
    if (!res.ok) {
        console.log(`Nie można pobrać strony ${url}. Status: ${res.status}`);
        return [];
    }

    const html = await res.text(); 
    const $ = cheerio.load(html); 

    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const data = JSON.parse($(el).html());

            if ( data["@type"] === "WebPage" && data.mainEntity?.itemListElement) {
                data.mainEntity.itemListElement.forEach((item) => {
                    if (item.name && item.offers?.price) {
                        const prodUrl = item.offers.url.startsWith("http")
                            ? item.offers.url
                            : `https://fmic.pl${item.offers.url}`;

                        productsOnPage.push({
                            name: item.name,
                            price: parseFloat(item.offers.price),
                            url: prodUrl,
                        });
                    }
                });
            }
        } catch (e) {
            throw new Error(`Błąd parsowania JSON-LD na stronie ${url}: ${e.message}`);
        }
    });
    return productsOnPage;
}

export const getPageDetails = async (url, productsOnPage) => { 
    const scrapedIntercoolers = [];
    
    for (const prod of productsOnPage) {
        const res = await fetch(prod.url);
        const html = await res.text();

        const htmlWithNormalSpaces = html.replace(/&nbsp;/g, " ").replace(/×/g, "x"); //usuwanie spacji FIXME Czystszy sposób
        const dimensionsRegex = /(\d{2,4})\s*x\s*(\d{2,4})\s*x\s*(\d{2,4})\s*mm/i; 

        const match = htmlWithNormalSpaces.match(dimensionsRegex);

        if (match) {
            const height = parseInt(match[1]);
            const width = parseInt(match[2]);
            const depth = parseInt(match[3]);

            if (height > MIN_INTERCOOLER_DIMENSION && width > MIN_INTERCOOLER_DIMENSION && depth > MIN_INTERCOOLER_DIMENSION) {
                const intercoolerVolume = (height * width * depth) / 1000;
                const priceFor1Cm3 = prod.price / intercoolerVolume;
                
                scrapedIntercoolers.push({
                    ...prod,
                    dimensions: `${height}x${width}x${depth} mm`,
                    volumeCm3: intercoolerVolume,
                    priceFor1Cm3: priceFor1Cm3
                });
            } 
        }
    }
    return scrapedIntercoolers;
}