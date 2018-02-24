# coding=utf-8

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field


class TrainerItem(Item):
    name = Field()
    brand = Field()
    link = Field()
    type = Field()
    price = Field()
    previous_price = Field()
    stock_img = Field()
    alt_img = Field()
    size = Field()
    found = Field()
    shop = Field()
