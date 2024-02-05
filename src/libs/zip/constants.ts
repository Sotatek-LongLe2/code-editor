
// Compression methods
export const COMPRESSION_METHOD_DEFLATE = 0x08;
export const COMPRESSION_METHOD_STORE = 0x00;
export const COMPRESSION_METHOD_AES = 0x63;

// Signatures for various parts of the ZIP file
export const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
export const SPLIT_ZIP_FILE_SIGNATURE = 0x08074b50;
export const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
export const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;

// Lengths of various ZIP file sections
export const END_OF_CENTRAL_DIR_LENGTH = 22;

// Extra field types
export const EXTRAFIELD_TYPE_NTFS = 0x000a;
export const EXTRAFIELD_TYPE_NTFS_TAG1 = 0x0001;

// Bit flags and attributes
export const DESCRIPTOR_BYTES_LENGTH = 0x10;

// Versions
export const VERSION_DEFLATE = 0x14;
export const VERSION_ZIP64 = 0x2d;
export const VERSION_AES = 0x33;

// Directory separator
export const DIRECTORY_SIGNATURE = '/';

// Date range for ZIP file
export const MAX_DATE = new Date(2107, 11, 31);
export const MIN_DATE = new Date(1980, 0, 1);

// Undefined value and types
export const UNDEFINED_VALUE = undefined;
export const UNDEFINED_TYPE = 'undefined';
export const FUNCTION_TYPE = 'function';

// Regular expression for binary file types
export const BINARY_FILE_TYPES =
  /\.(jpeg|jpg|png|gif|bmp|mp3|wav|flac|mp4|avi|mkv|pdf|docx|xlsx|pptx|zip|rar|tar|exe|dll|sqlite|db|bin)$/i;

// External permission values for files and folders
export const EXTERNAL_PERMISSION_FILE = 2176057344; // rwx
export const EXTERNAL_PERMISSION_FOLDER = 1107099648; // rwx

// CRC32 generator polynomial
export const GENERATOR_POLYNOMIAL_CRC32 = 0xedb88320;
