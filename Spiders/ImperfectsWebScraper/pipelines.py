# -*- coding: utf-8 -*-
import pymongo
import datetime


class ImperfectswebscraperPipeline(object):

    collection_name = 'trainers'
    stats_collection = 'crawlers'

    def process_item(self, item, spider):
        self.db[self.collection_name].insert_one(dict(item))
        return item

    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI'),
            mongo_db=crawler.settings.get('MONGO_DATABASE', 'items')
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        self.db[self.stats_collection].insert_one(dict(
            {"name": spider.name,
             "processed": spider.processed,
             "last_run": datetime.datetime.utcnow()}))
        print("####### " + spider.name + " have finished! " +
              str(spider.processed) + " trainers found. ################")
