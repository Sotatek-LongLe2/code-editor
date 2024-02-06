/**
 * Retrieves the MIME type based on the file extension.
 *
 * @param {string} fileName - The name of the file.
 * @returns {string} - The MIME type corresponding to the file extension.
 */
export function getMimeType(fileName: string) {
  const extension = fileName.split('.').slice(-1)[0].toLowerCase();

  const mimeTypes: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    webp: 'image/webp',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogg',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    tar: 'application/x-tar',
    exe: 'application/octet-stream',
    dll: 'application/octet-stream',
    sqlite: 'application/x-sqlite3',
    db: 'application/octet-stream',
    json: 'application/json',
    xml: 'application/xml',
    yaml: 'application/x-yaml',
    txt: 'text/plain',
    csv: 'text/csv',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    jsx: 'text/jsx',
    ts: 'application/typescript',
    tsx: 'text/tsx',
    md: 'text/markdown',
    rtf: 'application/rtf',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    eot: 'application/vnd.ms-fontobject',
    otf: 'font/otf',
    // Add more mappings as needed
  };

  const mimeType = mimeTypes[extension];
  if (!mimeType) {
    return 'application/octet-stream';
  }

  return mimeType;
}

/**
 * Concatenates multiple Uint8Arrays into a single Uint8Array.
 *
 * @param {...Uint8Array} arrays - The Uint8Arrays to concatenate.
 * @returns {Uint8Array} - The concatenated Uint8Array.
 * @example
 * const arr1 = new Uint8Array([1, 2, 3]);
 * const arr2 = new Uint8Array([4, 5, 6]);
 * const concatenatedArray = concatUint8Arrays(arr1, arr2);
 * console.log(concatenatedArray); // Output: Uint8Array [1, 2, 3, 4, 5, 6]
 */
export function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((length, arr) => length + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}

/**
 * Creates a Blob with the specified content and triggers a file download
 * in the browser.
 *
 * @param {string} fileName - The name of the file to be downloaded.
 * @param {Uint8Array} content - The content of the file as a Uint8Array.
 * @returns {void}
 */
export function createAndDownloadFile(fileName: string, content: Uint8Array): void {
  const mimeType = getMimeType(fileName);
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('download', fileName);
  a.setAttribute('target', '_blank');
  a.href = url;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Converts a number into a Uint8Array of specified length, representing its bytes.
 *
 * @param {number} value - The number to convert.
 * @param {number} numBytes - The length of the resulting Uint8Array.
 * @returns {Uint8Array} - The Uint8Array representing the bytes of the number.
 *
 * @example
 * const num = 305419896; // 0x12345678
 * const byteArray = numberToBytes(num, 4);
 * console.log(byteArray); // Output: Uint8Array [120, 86, 52, 18]
 */

export function numberToBytes(value: number, numBytes: number): Uint8Array {
  const result = new Uint8Array(numBytes);

  // Iterate over each byte
  for (let i = 0; i < numBytes; i++) {
    // Shift the bits of the value to the right by (i * 8) and use bitwise AND to get the lowest byte
    result[i] = (value >> (i * 8)) & 0xff;
  }

  return result;
}

/**
 * Retrieves the current date and time components and converts them to the
 * format used in ZIP file headers.
 * @returns An object containing last modification date and time components.
 */
export function getCurrentTimestamps() {
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const lastModTime = (hours << 11) | (minutes << 5) | (seconds / 2);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based
  const day = currentDate.getDate();

  const lastModDate = ((year - 1980) << 9) | (month << 5) | day;

  return {
    lastModDate,
    lastModTime,
  };
}

export const onCheckFileType = (tab: string) => {
  switch (tab.split('.').pop()) {
    case 'png':
    case 'jpeg':
    case 'jpg':
      return true;
    default:
      return false;
  }
};

export const onCheckLanguage = (lang: string) => {
  switch (lang.split('.').pop()) {
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    default:
      return '';
  }
};
