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
 
def alterText(text, stemmer, stopWords, lemmatizer):
    alteredWord = []
    stem_words = dict()
    #remove any additional spacing etc
    words = re.findall(r'\w+', text, flags = re.UNICODE)
    for word in words:
        word = word.lower()
        #remove alphanum and digits
        word = ''.join([i for i in word if not i.isdigit() and i.isalnum()])
        #remove stopWords
        if(word not in stopWords):
            #lemamtize all the words
            word = lemmatizer.lemmatize(word)
            #remove stem words, while preserving one of the words for each stem, because we need to create word cloud for the de-stemmed word and not just the stem
            temp_word = word
            new_word = stemmer.stem(word)
            if new_word in stem_words.keys():
                stem_words[new_word].append(temp_word)
            else:
                stem_words[new_word] = [temp_word]
            word = stem_words[new_word][0]
            alteredWord.append(word)
        else:
            continue
    return alteredWord, stem_words

stemmer = SnowballStemmer("english")
stopWords = nltk.corpus.stopwords.words('english')
lemmatizer = WordNetLemmatizer()
text, stem_words = alterText(text, stemmer, stopWords, lemmatizer)
print(text)
