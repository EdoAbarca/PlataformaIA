import re
from docx import Document
from PyPDF2 import PdfFileReader
from keras.models import load_model


def extract_text_from_document(document_path):
    if document_path.endswith('.pdf'):
        with open(document_path, 'rb') as file:
            pdf = PdfFileReader(file)
            text = ''
            for page in range(pdf.getNumPages()):
                text += pdf.getPage(page).extractText()
        return text
    elif document_path.endswith('.docx'):
        document = Document(document_path)
        text = ' '.join([paragraph.text for paragraph in document.paragraphs])
        return text
    else:
        raise ValueError("Unsupported document format")

def preprocess_text(text):
    # Split text before "abstract" or "resumen"
    abstract_start = re.search(r'\b(abstract|resumen)\b', text, flags=re.IGNORECASE)
    if abstract_start:
        text = text[abstract_start.end():]

    # Split text after "references" or "referencias"
    references_end = re.search(r'\b(references|referencias)\b', text, flags=re.IGNORECASE)
    if references_end:
        text = text[:references_end.start()]

    return text

    

def process_documents(docs):
    response_data = []
    model = load_model('path/to/model.h5')
    for doc in docs:
        text = extract_text_from_document(doc)
        text = preprocess_text(text)

        # Split text every 200 words
        text_chunks = [text[i:i+200] for i in range(0, len(text), 200)]

        fake_predictions = 0
        for chunk in text_chunks:
            prediction = model.predict(chunk)
            if prediction == "fake":
                fake_predictions += 1

        average_fake_predictions = fake_predictions / len(text_chunks)

        response_data.append({
            'title': doc['title'],
            'prediction': "Fake" if average_fake_predictions > 0.5 else "Real",
            'score': average_fake_predictions
        })

        #total_fake_predictions += fake_predictions

    return response_data
