import base64

def hashText(text):
    hashText = bytearray()
    hashText.extend(map(ord, text))
    hashText = base64.b64encode(hashText).decode() #keep password encrypted in base64
    return hashText