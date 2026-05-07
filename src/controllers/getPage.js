import * as cheerio from "cheerio";

export const getPage = async (url) => {
    let productsOnPage = [];

    try{
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

    } catch (err) {
        console.error('Error getting page:', err);
        throw err;
    }
}
