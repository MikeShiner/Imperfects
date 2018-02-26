# coding=utf-8
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from spiders.OfficeSpider import OfficeSpider
from spiders.SchuhSpider import SchuhSpider
#from importlib import reload
##import sys
import pymongo


def purgeCollection():
    client = pymongo.MongoClient('mongodb://localhost:27017')
    collection = client['imperfects']['trainers']
    collection.remove()
    print("=================================================")
    print("============= Mongo Trainers Cleared ============")
    print("=================================================")


# reload(sys)
# sys.setdefaultencoding("utf-8")

purgeCollection()

process = CrawlerProcess(get_project_settings())
process.crawl(OfficeSpider)
process.crawl(SchuhSpider)
process.start()
