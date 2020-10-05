import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def read_document(DocID):
    # Use a service account
    cred = credentials.Certificate('WordCloudEnv\Scripts\wordcloud-3e528-4c26154a4280.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    data = db.collection(u'TextData').document(DocID).get().to_dict()
    if data:
        return data
    else: 
        return None