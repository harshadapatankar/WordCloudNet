import firebase_admin
from firebase_admin import credentials
#from firebase_admin import firestore
from firebase_admin import db

class DabaseAccessor:
    def __init__(self):
        import os
        from sys import platform
        this_file = os.path.dirname(os.path.abspath(__file__))
        if platform == "linux" or platform == "linux2" or platform == "darwin":
            this_file += "/wordCloudEnv/bin/wordcloud-firebase-secretkey.json"
        elif platform == "win32":
            this_file += "/wordCloudEnv/Scripts/wordcloud-firebase-secretkey.json"
        cred = credentials.Certificate(this_file)
        firebase_admin.initialize_app(cred, {
            'databaseURL': 'https://wordcloud-3e528.firebaseio.com',
            'databaseAuthVariableOverride': None
        })
        self.__db__ = db

    def read_document(self, DocID):
        data = self.__db__.reference('TextData/-'+DocID).get()
        if data:
            return data
        else: 
            return None

    def update_global_db(self, word_count):
        globaldb_ref = self.__db__.reference('GlobalWordCounts')
        globaldb = self.__db__.reference('GlobalWordCounts').get()
        for myword in word_count.keys():
            if myword in globaldb.keys():
                globaldb[myword] = globaldb[myword] + word_count[myword]
            else:
                globaldb[myword] = word_count[myword]
        globaldb_ref.set(globaldb)

    def get_global_db(self, word_count):
        global_word_count = dict()
        globaldb = self.__db__.reference('GlobalWordCounts').get()
        for word in word_count.keys():
            db_word = globaldb[word]
            if db_word:
                global_word_count[word] = db_word['count']
        return global_word_count

    def update_response_word_count_db(self, DocId, word_count):
        self.__db__.reference('ResponseWordCount').child(DocId).set(word_count)

    def update_response_frequencies_db(self, DocId, sorted_freq_count):
        self.__db__.reference('ResponseFrequencies').child(DocId).set(sorted_freq_count)
        