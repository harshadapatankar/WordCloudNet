import activateEnv
activateEnv.activate()
import argparse
import databaseAccessor

parser = argparse.ArgumentParser()
parser.add_argument('-d', '--DocId', help='Mention the DocumentID of Firebase stored text', required=True)
args = parser.parse_args() 
documentId = args.DocId

dbData = databaseAccessor.read_document(documentId)
if not (dbData):
    print("No such document")
    exit()

print(dbData)