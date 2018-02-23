# coding=utf-8
import scrapy
from scrapy.http import *
import json
from scrapy.selector import HtmlXPathSelector
from scrapy.selector import Selector
import unicodedata
from scrapy import signals
from pydispatch import dispatcher
from scrapy.crawler import CrawlerProcess
from items import TrainerItem
from scrapy.utils.project import get_project_settings
import pickle


class SchuhSpider(scrapy.Spider):

    name = "SchuhSpider"
    payload = {"hash": "g=3|Mens,&c2=340|Mens Trainers&imp=1&o=new&",
               "url": "/imperfects/", "type": "pageLoad", "NonSecureUrl": "http://www.schuh.co.uk"}
    url = "http://schuhservice.schuh.co.uk/SearchService/GetResults"
    headers = {'Content-Type': 'application/json; charset=UTF-8'}
    processed = 0

    def start_requests(self):
        requests_list = []
        for i in range(0, 50):
            pagePayload = dict(self.payload)
            pagePayload["hash"] = self.payload["hash"] + "page=" + str(i)
            requests_list.append(scrapy.Request(url=self.url, callback=self.parse,
                                                method="POST", body=json.dumps(pagePayload), headers=self.headers))
        return requests_list

    def parse(self, response):
        jsonresponse = json.loads(response.body)["d"][0]
        normalizedString = unicodedata.normalize("NFKD", jsonresponse)
        response = Selector(text=normalizedString)

        for product in response.css("li.product"):
            isVariation = False
            dataImp = product.css("a::attr(data-impicode)").extract_first()
            if dataImp is not None:
                isVariation = True
                variantHash = self.payload
                variantHash["type"] = "imperfectVariation" + dataImp
                yield scrapy.Request(url=self.url, callback=self.parse, method="POST", body=json.dumps(variantHash), headers=self.headers)
            else:
                trainer = self.getMetaInfo(product)
                yield scrapy.Request(url=trainer.get("link"), callback=self.parse_product, meta={'trainerData': trainer})

    def parse_product(self, response):
        trainer = response.meta["trainerData"]
        trainer["alt_img"] = response.xpath(
            "//div[@id='swipe']/ul//img/@src").extract()
        trainer["size"] = response.xpath(
            "//option[contains(@class,'sizeAvailable')]/text()").extract_first().replace("UK", "").replace(" ", "")
        self.processed += 1
        yield trainer

    def getMetaInfo(self, product):
        trainer = TrainerItem()
        trainer["link"] = product.css("a::attr(href)").extract_first().replace(
            "//", "/").replace("http:/", "http://")
        trainer["brand"] = product.css("p.brand::text").extract_first()
        trainer["name"] = product.css("p.name::text").extract_first()
        trainer["type"] = product.css("p.style::text").extract_first()
        trainer["price"] = product.css(
            "p.reduction::text").extract_first().replace("£", "")
        trainer["previous_price"] = product.css(
            "span.reductionStrike::text").extract_first().replace("was £", "")
        trainer["stock_img"] = product.css("img::attr(src)").extract_first()
        return trainer
