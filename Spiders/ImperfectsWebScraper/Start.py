# coding=utf-8
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from spiders.OfficeSpider import OfficeSpider
from spiders.SchuhSpider import SchuhSpider
import sys
import pymongo


def purgeCollection():
    client = pymongo.MongoClient('mongodb://localhost:27017')
    db = client['imperfects']['trainers']
    collection = db['trainers']
    collection.remove()
    print("============= Mongo Trainers Cleared ============")


reload(sys)
sys.setdefaultencoding("utf-8")

purgeCollection()

process = CrawlerProcess(get_project_settings())
process.crawl(OfficeSpider)
process.crawl(SchuhSpider)
process.start()
