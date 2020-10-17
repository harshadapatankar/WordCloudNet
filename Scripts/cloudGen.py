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
dbAccessor = databaseAccessor.DabaseAccessor()

dbData = dbAccessor.read_document(documentId)
if not (dbData):
    print("No such document")
    exit()

text = dbData['text']

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

#word -> count (Logical Representation)
word_count = dict()
for word in text:
    if word != '':
        if word in word_count.keys():
            word_count[word] = word_count[word] + 1
        else:
            word_count[word] = 1

dbAccessor.update_global_db(word_count)
#print(dbAccessor.get_global_db(word_count))
dbAccessor.update_response_word_count_db(documentId, word_count)

#count -> [word1, word2.....] (Logical Representation)
freq_to_words = dict()         
for word in word_count.keys():
    freq = word_count[word]
    if freq in freq_to_words.keys():
        freq_to_words[freq].append(word)
    else: 
        freq_to_words[freq] = [word]

sorted_freq_to_words = dict()
for key in sorted(freq_to_words.keys(), reverse = True):
    sorted_freq_to_words[key] = freq_to_words[key]

dbAccessor.update_response_frequencies_db(documentId, sorted_freq_to_words)
#print(sorted_freq_to_words)