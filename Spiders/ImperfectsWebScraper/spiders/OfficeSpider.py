# coding=utf-8
import json
import unicodedata
import scrapy
import re
from scrapy.http import *
from scrapy.selector import HtmlXPathSelector, Selector
from items import TrainerItem


class OfficeSpider(scrapy.Spider):

    name = "OfficeSpider"
    start_urls = [
        'https://offcutsshoes.co.uk/collections/mens/trainers?page=1'
    ]
    colours = ['Beige', 'Black', 'Blue', 'Brown', 'Burgundy', 'Cream', 'Gold', 'Green', 'Grey', 'Multi', 'Multi-Coloured', 'Natural',
               'NavyBlue', 'Orange', 'Pink', 'Purple', 'Red', 'Silver', 'Tan', 'White', 'Yellow', 'Olive', 'Khaki', 'Light', 'Metallic', 'Sail']
    originalUrl = 'https://offcutsshoes.co.uk'
    processed = 0

    def parse(self, response):

        for product in response.css('div.product-list-item'):
            try:
                trainer = TrainerItem()

                trainer["brand"] = product.css(
                    "p.product-list-item-vendor > a::text").extract_first()

                fullname = product.css(
                    "h3.product-list-item-title > a::text").extract_first()

                sizeRe = re.search(r'(Uk|UK)* Size.\d\.*\d*', fullname).group()
                trainer["size"] = sizeRe.replace("Uk Size ", "")
                trainer["name"] = fullname.replace(sizeRe, "").replace(
                    "Mens ", "").replace(trainer["brand"], "").replace(" - ", "")

                for colour in self.colours:
                    trainer["name"] = trainer["name"].replace(
                        colour, "").strip()
                trainer["price"] = product.css(
                    "span.money::text").extract_first().replace("£", "")

                # Original Price is optional on some occassions
                original_price = product.css(
                    "span.original::text").extract_first()
                if original_price is not None:
                    trainer["previous_price"] = original_price.replace("£", "")
                else:
                    trainer["previous_price"] = 0

                trainer["type"] = "Trainer"
                trainer["link"] = self.originalUrl + product.css(
                    "figure > a::attr(href)").extract_first()

                yield scrapy.Request(url=trainer.get("link"), callback=self.resolveImg, meta={'trainerData': trainer})
            except Exception as e:
                print("Error processing trainer. " + product.css(
                    "figure > a::attr(href)").extract_first() + " EX: " + str(e))

            nextpage = response.css(
                'li.pagination-next > a::attr(href)').extract_first()
            if nextpage is not None:
                yield scrapy.Request(url=self.originalUrl + nextpage, callback=self.parse)

    def resolveImg(self, response):
        try:
            trainer = response.meta["trainerData"]
            trainer["stock_img"] = response.css(
                "div.product-main-image > img::attr(src)").extract_first()
            images = response.css(
                "div.product-thumbnails > img::attr(data-high-res)").extract()
            trainer["stock_img"] = images[0]
            images.pop(0)
            trainer["alt_img"] = images
            self.processed += 1
            yield trainer
        except:
            print("Error resolving images")
