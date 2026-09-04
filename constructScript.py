import base64
import re

# https://www.w3schools.com/tools/tool_mime_types.php
mimetypes = {
  "html":"text/html",
  "htm":"text/html",
  "css":"text/css",
  "js":"text/javascript",
  "mjs":"text/javascript",
  "json":"application/json",
  "xml":"application/xml",
  "csv":"text/csv",
  "yaml":"application/x-yaml",
  "yml":"application/x-yaml",
  "txt":"text/plain",
  "md":"text/markdown",
  "rtf":"application/rtf",
  "pdf":"application/pdf",
  "doc":"application/msword",
  "docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "xls":"application/vnd.ms-excel",
  "xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "ppt":"application/vnd.ms-powerpoint",
  "pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "png":"image/png",
  "jpg":"image/jpeg",
  "jpeg":"image/jpeg",
  "gif":"image/gif",
  "svg":"image/svg+xml",
  "webp":"image/webp",
  "ico":"image/x-icon",
  "bmp":"image/bmp",
  "tiff":"image/tiff",
  "avif":"image/avif",
  "mp3":"audio/mpeg",
  "wav":"audio/wav",
  "ogg":"audio/ogg",
  "flac":"audio/flac",
  "aac":"audio/aac",
  "weba":"audio/webm",
  "mp4":"video/mp4",
  "webm":"video/webm",
  "avi":"video/x-msvideo",
  "mov":"video/quicktime",
  "mkv":"video/x-matroska",
  "wmv":"video/x-ms-wmv",
  "zip":"application/zip",
  "gz":"application/gzip",
  "tar":"application/x-tar",
  "rar":"application/vnd.rar",
  "7z":"application/x-7z-compressed",
  "bz2":"application/x-bzip2",
  "woff":"font/woff",
  "woff2":"font/woff2",
  "ttf":"font/ttf",
  "otf":"font/otf",
  "eot":"application/vnd.ms-fontobject",
  "wasm":"application/wasm",
  "php":"application/x-httpd-php",
  "py":"text/x-python",
  "java":"text/x-java-source",
  "c":"text/x-c",
  "cpp":"text/x-c++src",
  "ts":"text/typescript",
  "tsx":"text/typescript-jsx",
  "jsx":"text/jsx",
  "sh":"application/x-sh",
  "sql":"application/sql",
  "ics":"text/calendar",
  "vcf":"text/vcard",
  "bin":"application/octet-stream",
  "exe":"application/octet-stream",
  "apk":"application/vnd.android.package-archive",
  "dmg":"application/x-apple-diskimage",
}

def getDataUri(match:re.Match):
  filePath:str = match[0]
  filePath = filePath.replace("getDataUri(\"","")
  filePath = filePath.replace("\")","")
  
  
  with open(filePath,"rb") as dataFile:
    b64Data = base64.b64encode(dataFile.read()).decode()
    
  mimeType = mimetypes[filePath.split(".")[-1]]
  return f"\"data:{mimeType or ""};base64,{b64Data}\""

  
with open("./TamperImpConstructor.js","r") as constructorFile:
  constructorData = constructorFile.read()

finalData = re.sub(r"getDataUri\(\".*?\"\)",getDataUri,constructorData)

with open("./TamperImp.js","w") as scriptFile:
  scriptFile.write(finalData)