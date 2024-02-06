export const CompressionMethods = {
  DEFLATE: 0x08,
  STORE: 0x00,
  AES: 0x63,
};

export const Signatures = {
  LOCAL_FILE_HEADER: 0x04034b50,
  SPLIT_ZIP_FILE: 0x08074b50,
  CENTRAL_FILE_HEADER: 0x02014b50,
  END_OF_CENTRAL_DIR: 0x06054b50,
};

export const Lengths = {
  END_OF_CENTRAL_DIR: 22,
};

export const ExtraFieldTypes = {
  NTFS: 0x000a,
  NTFS_TAG1: 0x0001,
};

export const DescriptorBytesLength = 0x10;

export const Versions = {
  DEFLATE: 0x14,
  ZIP64: 0x2d,
  AES: 0x33,
};

export const DirectorySignature = '/';

export const DateRange = {
  MAX_DATE: new Date(2107, 11, 31),
  MIN_DATE: new Date(1980, 0, 1),
};

export const UndefinedValues = {
  VALUE: undefined,
  TYPE: 'undefined',
  FUNCTION_TYPE: 'function',
};

export const BinaryFileTypes =
  /\.(jpeg|jpg|png|gif|bmp|mp3|wav|flac|mp4|avi|mkv|pdf|docx|xlsx|pptx|zip|rar|tar|exe|dll|sqlite|db|bin)$/i;

export const ExternalPermissions = {
  FILE: 2176057344, // rwx
  FOLDER: 1107099648, // rwx
};

export const GeneratorPolynomialCRC32 = 0xedb88320;
