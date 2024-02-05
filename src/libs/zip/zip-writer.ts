import pako from 'pako';

import {
  CENTRAL_FILE_HEADER_SIGNATURE,
  COMPRESSION_METHOD_DEFLATE,
  COMPRESSION_METHOD_STORE,
  DESCRIPTOR_BYTES_LENGTH,
  DIRECTORY_SIGNATURE,
  END_OF_CENTRAL_DIR_SIGNATURE,
  EXTERNAL_PERMISSION_FILE,
  EXTERNAL_PERMISSION_FOLDER,
  GENERATOR_POLYNOMIAL_CRC32,
  LOCAL_FILE_HEADER_SIGNATURE,
  SPLIT_ZIP_FILE_SIGNATURE,
} from './constants';
import { IFileTree, ZipEntry } from './types';
import { concatUint8Arrays, createAndDownloadFile, getCurrentTimestamps, numberToBytes } from './ultils';

export class ZipWriter {
  private entries: ZipEntry[];
  private name: string;

  constructor(name?: string) {
    this.entries = [];
    this.name = name || 'data.zip';
  }

  addFile(name: string, content: string | Uint8Array) {
    this.entries.push({ name, content });
  }

  /**
   * Generates a ZIP file content based on the entries added to the ZipWriter.
   *
   * @returns {Uint8Array} The generated ZIP file content as a Uint8Array.
   */
  generate(): Uint8Array {
    let centralDirectory = new Uint8Array(0);
    let centralDirectoryOffset = 0;
    let zipContent = new Uint8Array(0);
    let previousEntriesLength = 0;

    for (const entry of this.entries) {
      const uncompressedData =
        typeof entry.content === 'string' ? new TextEncoder().encode(entry.content) : entry.content;

      const crc32 = this.calculateCRC32(uncompressedData);
      const { method: compressionMethod, data: compressedData } = this.compressData(uncompressedData);
      const localFileHeader = this.createLocalFileHeader(
        entry,
        compressedData.length,
        uncompressedData.length,
        compressionMethod,
        crc32,
      );

      zipContent = this.concatUint8Arrays(
        zipContent,
        localFileHeader,
        compressedData,
        numberToBytes(SPLIT_ZIP_FILE_SIGNATURE, 4),
        numberToBytes(crc32, 4),
        numberToBytes(compressedData.length, 4),
        numberToBytes(uncompressedData.length, 4),
      );

      centralDirectory = this.concatUint8Arrays(
        centralDirectory,
        this.createCentralDirectoryEntry(
          entry,
          localFileHeader.length,
          compressedData.length,
          uncompressedData.length,
          compressionMethod,
          crc32,
          previousEntriesLength,
        ),
      );
      previousEntriesLength += localFileHeader.length + compressedData.length + DESCRIPTOR_BYTES_LENGTH;
    }

    centralDirectoryOffset = zipContent.length;
    zipContent = this.concatUint8Arrays(zipContent, centralDirectory);

    const endOfCentralDirectory = this.createEndOfCentralDirectory(
      centralDirectoryOffset,
      this.entries.length,
      centralDirectory.length,
    );
    zipContent = this.concatUint8Arrays(zipContent, endOfCentralDirectory);

    return zipContent;
  }

  /**
   * Generates a ZIP file from a file tree structure and initiates the download of the generated file.
   * The generated file will be named based on the ZipWriter instance's name property.
   * Download file zip
   *
   * @param {IFileTree} fileTree - The file tree structure to be converted into a ZIP file.
   * @returns {Uint8Array} The generated ZIP file content as a Uint8Array.
   */
  generateFromFileTree(fileTree: IFileTree) {
    this.entries = this.convertFileTreeToZipEntries(fileTree);
    const bytes = this.generate();
    createAndDownloadFile(this.name, bytes);
    return bytes;
  }

  /**
   * Recursively converts a file tree structure into an array of ZipEntry objects.
   *
   * @param {IFileTree} fileTree - The file tree structure to be converted.
   * @param {string} basePath - The base path used for constructing full file paths.
   * @returns {ZipEntry[]} An array of ZipEntry objects representing the file tree.
   */
  private convertFileTreeToZipEntries(fileTree: IFileTree, basePath = ''): ZipEntry[] {
    const entries: ZipEntry[] = [];

    for (const [key, value] of Object.entries(fileTree)) {
      const fullPath = basePath ? `${basePath}/${key}` : key;

      if (
        typeof value === 'object' &&
        value !== null &&
        'content' in value &&
        (typeof value['content'] === 'string' || value['content'] instanceof Uint8Array)
      ) {
        // Leaf node with content
        entries.push({ name: fullPath, content: value.content });
      } else {
        // Directory node
        entries.push(...this.convertFileTreeToZipEntries(value as IFileTree, fullPath));
      }
    }

    return entries;
  }

  private createLocalFileHeader(
    entry: ZipEntry,
    compressedSize: number,
    uncompressedSize: number,
    compressionMethod: number,
    crc32: number,
  ): Uint8Array {
    const signature = LOCAL_FILE_HEADER_SIGNATURE;
    const versionNeededToExtract = 0x0014; // Version 2.0
    const generalPurposeBitFlag = compressionMethod === COMPRESSION_METHOD_DEFLATE ? 0x0008 : 0x0000;

    const { lastModDate, lastModTime } = getCurrentTimestamps();
    const fileNameBytes = new TextEncoder().encode(entry.name);

    const fileNameLength = fileNameBytes.length;
    const extraFieldLength = 0;

    const localFileHeader = this.concatUint8Arrays(
      numberToBytes(signature, 4),
      numberToBytes(versionNeededToExtract, 2),
      numberToBytes(generalPurposeBitFlag, 2),
      numberToBytes(compressionMethod, 2),
      numberToBytes(lastModTime, 2),
      numberToBytes(lastModDate, 2),
      numberToBytes(crc32, 4),
      numberToBytes(compressedSize, 4),
      numberToBytes(uncompressedSize, 4),
      numberToBytes(fileNameLength, 2),
      numberToBytes(extraFieldLength, 2),
      fileNameBytes,
    );

    return localFileHeader;
  }

  private createCentralDirectoryEntry(
    entry: ZipEntry,
    localFileHeaderLength: number,
    compressedSize: number,
    uncompressedSize: number,
    compressionMethod: number,
    crc32: number,
    previousEntriesLength: number,
  ): Uint8Array {
    const signature = CENTRAL_FILE_HEADER_SIGNATURE;
    const versionMadeBy = 0x0314; // 778 unix
    const versionNeededToExtract = 20; // Version 2.0
    const generalPurposeBitFlag = compressionMethod === COMPRESSION_METHOD_DEFLATE ? 0x0008 : 0x0000;

    const fileNameBytes = new TextEncoder().encode(entry.name);
    const fileNameLength = fileNameBytes.length;
    const { lastModDate, lastModTime } = getCurrentTimestamps();

    const extraFieldLength = 0;
    const fileCommentLength = 0;
    const diskNumberStart = 0;
    const internalFileAttributes = 0;
    const externalFileAttributes = entry.name.endsWith(DIRECTORY_SIGNATURE)
      ? EXTERNAL_PERMISSION_FOLDER
      : EXTERNAL_PERMISSION_FILE; // rwx
    const relativeOffsetOfLocalHeader = previousEntriesLength; //localFileHeaderLength; // Relative offset from the beginning of the archive

    const centralDirectoryEntry = this.concatUint8Arrays(
      numberToBytes(signature, 4),
      numberToBytes(versionMadeBy, 2),
      numberToBytes(versionNeededToExtract, 2),
      numberToBytes(generalPurposeBitFlag, 2),
      numberToBytes(compressionMethod, 2),
      numberToBytes(lastModTime, 2),
      numberToBytes(lastModDate, 2),
      numberToBytes(crc32, 4),
      numberToBytes(compressedSize, 4),
      numberToBytes(uncompressedSize, 4),
      numberToBytes(fileNameLength, 2),
      numberToBytes(extraFieldLength, 2),
      numberToBytes(fileCommentLength, 2),
      numberToBytes(diskNumberStart, 2),
      numberToBytes(internalFileAttributes, 2),
      numberToBytes(externalFileAttributes, 4),
      numberToBytes(relativeOffsetOfLocalHeader, 4),
      fileNameBytes,
    );

    return centralDirectoryEntry;
  }

  private createEndOfCentralDirectory(
    centralDirectoryOffset: number,
    numEntries: number,
    totalCentralDirectorySize: number,
  ): Uint8Array {
    const signature = END_OF_CENTRAL_DIR_SIGNATURE;
    const diskNumber = 0;
    const centralDirectoryDisk = 0;
    const centralDirectoryStartOffset = centralDirectoryOffset; // The offset of the start of the central directory relative to the starting disk number
    const commentLength = 0;

    const endOfCentralDirectory = this.concatUint8Arrays(
      numberToBytes(signature, 4),
      numberToBytes(diskNumber, 2),
      numberToBytes(centralDirectoryDisk, 2),
      numberToBytes(numEntries, 2),
      numberToBytes(numEntries, 2),
      numberToBytes(totalCentralDirectorySize, 4),
      numberToBytes(centralDirectoryStartOffset, 4),
      numberToBytes(commentLength, 2),
    );
    return endOfCentralDirectory;
  }

  private concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
    return concatUint8Arrays(...arrays);
  }

  private calculateCRC32(data: Uint8Array): number {
    const crcTable = new Uint32Array(256);

    for (let i = 0; i < 256; i++) {
      let crc = i;
      for (let j = 0; j < 8; j++) {
        crc = crc & 1 ? (crc >>> 1) ^ GENERATOR_POLYNOMIAL_CRC32 : crc >>> 1;
      }
      crcTable[i] = crc >>> 0;
    }

    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xff];
    }

    return (crc ^ 0xffffffff) >>> 0;
  }

  private compressData(rawData: Uint8Array) {
    const compressedData = pako.deflateRaw(rawData);

    return compressedData.length < rawData.length
      ? {
          data: compressedData,
          method: COMPRESSION_METHOD_DEFLATE,
        }
      : {
          data: rawData,
          method: COMPRESSION_METHOD_STORE,
        };
  }
}
