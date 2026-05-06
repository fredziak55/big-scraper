import * as cheerio from "cheerio";
import insertProduct from "../models/insertScrapedProducts.js";
import purgeIntercoolers from "../models/purgeIntercoolers.js";

const BASE_URL = `${process.env.BASE_URL}`;
console.log(`BASE_URL: ${BASE_URL}`);

const scrapeIntercoolers = (app) => {
    app.post('/scrape', async (req, res) => {
        await purgeIntercoolers();
        const MAX_PAGES = parseInt(req.body?.max_pages) || 0
        // const MAX_PAGES = parseInt(maxPages) || 0; // 0 = brak limitu
        let page = 1;

        console.log("pobieranie listy produktów");

        while (true) {
            let productsOnPage = [];
            if (MAX_PAGES > 0 && page > MAX_PAGES) {
                //do limitu
                console.log(`Osiągnięto limit stron MAX_PAGES=${MAX_PAGES}.`);
                break;
            }

            const url = page === 1 ? BASE_URL : `${BASE_URL}?p=${page}`; // Strona 1 ma inny URL niz kolejne - nie pokazuje numeru
            console.log(`Pobieram stronę ${page}...`);

            try {
                const res = await fetch(url); // Wysyla zapytanie HTTP GET
                if (!res.ok) break; // Jesli status HTTP nie ok - koniec

                const html = await res.text(); // Odczytuje odpowiedz jako tekst HTML
                const $ = cheerio.load(html); // Laduje HTML do Cheerio
                let foundOnPage = false;

                // produktu sa zapisane w plikach JSON-LD w tagach <script type="application/ld+json">
                $('script[type="application/ld+json"]').each((_, el) => {
                    // Iteracja po wszystkich blokach JSON-LD
                    try {
                        const data = JSON.parse($(el).html());

                        if (
                            data["@type"] === "WebPage" &&
                            data.mainEntity?.itemListElement
                        ) {
                            data.mainEntity.itemListElement.forEach((item) => {
                                // Iteracja po pozycjach listy produktow
                                if (item.name && item.offers?.price) {
                                    // Bierzemy tylko rekordy z nazwa i cena ?- czy nie jest pusty
                                    // dopelenienie do pelnego url
                                    const prodUrl = item.offers.url.startsWith(
                                        "http"
                                    )
                                        ? item.offers.url
                                        : `https://fmic.pl${item.offers.url}`;

                                    productsOnPage.push({
                                        name: item.name,
                                        price: parseFloat(item.offers.price),
                                        url: prodUrl,
                                    });
                                    foundOnPage = true;
                                }
                            });
                        }
                    } catch (e) {
                        // Jesli JSON-LD jest niepoprawny, pomijamy ten blok
                    }
                });

                if (!foundOnPage) break;

                // Usuwanie duplikatow
                productsOnPage = [...new Map(productsOnPage.map((item) => [item.url, item])).values(),];
                console.log(`Na stronie ${page} znaleziono ${productsOnPage.length} unikalnych produktów. Zbieranie wymiarow`);

                for (let i = 0; i < productsOnPage.length; i++) {
                    const prod = productsOnPage[i];
                    console.log(`Analiza [${i + 1}/${productsOnPage.length}]: ${prod.name}`);

                    try {
                        const res = await fetch(prod.url);
                        const html = await res.text();

                        // Normalizacja tresci i regex do formatu rdzenia
                        const cleanHtml = html.replace(/&nbsp;/g, " ").replace(/×/g, "x"); //usuwanie spacji
                        const regex = /(\d{2,4})\s*x\s*(\d{2,4})\s*x\s*(\d{2,4})\s*mm/i; // Trzy wymiary w mm

                        const match = cleanHtml.match(regex);

                        if (match) {
                            const a = parseInt(match[1]);
                            const b = parseInt(match[2]);
                            const c = parseInt(match[3]);

                            // filtrowanie bledow
                            if (a > 20 && b > 20 && c > 20) {
                                const pojemnoscCm3 = (a * b * c) / 1000;
                                const cenaZaCm3 = prod.price / pojemnoscCm3;
                                
                                insertProduct(productsOnPage[i].name, productsOnPage[i].price, productsOnPage[i].url, `${a}x${b}x${c} mm`, pojemnoscCm3, cenaZaCm3);
                            }
                        }
                    } catch (e) {
                        console.log(`Błąd pobierania: ${prod.url}`);
                    }
                }

                page++;
            } catch (e) {
                // Blad fetch dla strony listy
                console.log("Błąd sieci:", e.message);
                break;
            }
        }
        console.log("Scraping zakończony.");
        res.status(200).json({ message: "Scraping zakończony" });
    });
}

export default scrapeIntercoolers;
