import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

class DabaseAccessor:
    def __init__(self):
        cred = credentials.Certificate('WordCloudEnv\Scripts\wordcloud-3e528-4c26154a4280.json')
        firebase_admin.initialize_app(cred)
        self.__db__ = firestore.client()

    def read_document(self, DocID):
        data = self.__db__.collection(u'TextData').document(DocID).get().to_dict()
        if data:
            return data
        else: 
            return None

    def update_global_db(self, word_count):
        globaldb_ref = self.__db__.collection(u'GlobalWordCounts')
        for myword in word_count.keys():
            word_ref = globaldb_ref.document(myword)
            word = word_ref.get()
            if(word.exists):
                new_word_count = word.to_dict()['count'] + word_count[myword]
                word_ref.set({u'count' : new_word_count})
            else:
                new_word_count = word_count[myword]
                globaldb_ref.document(myword).set({u'count' : new_word_count})

    def get_global_db(self, word_count):
        global_word_count = dict()
        globaldb = self.__db__.collection(u'GlobalWordCounts').stream()
        for word in globaldb:
            if word.id in word_count.keys():
                global_word_count[word.id] = word.to_dict()['count']
        return global_word_count

    def update_response_word_count_db(self, DocId, word_count):
        responsedb_ref = self.__db__.collection(u'ResponseWordCount').document(DocId).collection(u'Words')
        for myword in word_count.keys():
            new_word_count = word_count[myword]
            responsedb_ref.document(myword).set({u'count' : new_word_count})

    def update_response_frequencies_db(self, DocId, sorted_freq_count):
        responsedb_ref = self.__db__.collection(u'ResponseFrequencies').document(DocId).collection(u'Frequencies')
        for freq in sorted_freq_count.keys():
            new_word_count = sorted_freq_count[freq]
            responsedb_ref.document(str(freq)).set({u'words' : new_word_count})
        