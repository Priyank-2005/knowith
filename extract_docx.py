import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path, 'r') as docx_zip:
            xml_content = docx_zip.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            text_paragraphs = []
            for node in tree.iter():
                if node.tag == '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p':
                    para_text = "".join([t.text for t in node.findall('.//{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text])
                    if para_text:
                        text_paragraphs.append(para_text)
            return '\n'.join(text_paragraphs)
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == '__main__':
    if len(sys.argv) > 1:
        text = extract_text_from_docx(sys.argv[1])
        with open('docx_content_utf8.txt', 'w', encoding='utf-8') as f:
            f.write(text)
    else:
        print("Provide docx path")
