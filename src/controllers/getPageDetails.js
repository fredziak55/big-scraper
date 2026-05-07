export const getPageDetails = async (url, productsOnPage) => { 
    const scrapedIntercoolers = [];
    const minIntercoolerDimension = 20;

    for (let i = 0; i < productsOnPage.length; i++) {
        const prod = productsOnPage[i];
        try {
            const res = await fetch(prod.url);
            const html = await res.text();

            const htmlWithNormalSpaces = html.replace(/&nbsp;/g, " ").replace(/×/g, "x"); //usuwanie spacji FIXME Czystszy sposób
            const dimensionsRegex = /(\d{2,4})\s*x\s*(\d{2,4})\s*x\s*(\d{2,4})\s*mm/i; 

            const match = htmlWithNormalSpaces.match(dimensionsRegex);

            if (match) {
                const height = parseInt(match[1]);
                const width = parseInt(match[2]);
                const depth = parseInt(match[3]);

                if (height > minIntercoolerDimension && width > minIntercoolerDimension && depth > minIntercoolerDimension) {
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
        } catch (err) {
            console.error('Error getting page details:', err);
        }
    }
    return scrapedIntercoolers;
}