import activateEnv
activateEnv.activate()
import argparse
import databaseAccessor
import nltk
from langdetect import detect
from googletrans import Translator
import re
from nltk.stem import WordNetLemmatizer
from nltk.stem.snowball import SnowballStemmer

parser = argparse.ArgumentParser()
parser.add_argument('-d', '--DocumentId', help='Mention the DocumentID of Firebase stored text', required=True)
args = parser.parse_args() 
documentId = args.DocumentId

dbData = databaseAccessor.read_document(documentId)
if not (dbData):
    print("No such document")
    exit()

text = dbData['Text']

#translate text if not english
translator = Translator()
lang = detect(text)
if lang != 'en':
    text = translator.translate(text)