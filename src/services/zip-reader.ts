import pako from 'pako';

import {
  Signatures,
  BinaryFileTypes,
  DirectorySignature,
  DescriptorBytesLength,
  CompressionMethods,
} from 'types/constants';

import { TFileTree } from 'types/types';
import { getMimeType } from 'utils';

export class ZipReader {
  private reader: FileReader;

  constructor() {
    this.reader = new FileReader();
  }

  /**
   * Reads a ZIP file and returns the file tree with contents.
   *
   * @param {File} zipFile - The ZIP file to read.
   * @returns {Promise<{ fileTree: TFileTree }>} - A promise resolving to the file tree with contents.
   * @throws {Error} - Throws an error if the ZIP file is invalid.
   */
  public async readFile(zipFile: File) {
    const reader = this.reader;

    const uint8Array = await new Promise<Uint8Array>((resolve, reject) => {
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          resolve(uint8Array);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(zipFile);
    });
    if (new DataView(uint8Array.buffer, 0, 4).getUint32(0, true) === Signatures.LOCAL_FILE_HEADER) {
      const fileTree = this.readFileTreeWithContents(uint8Array);

      return {
        fileTree,
      };
    } else {
      throw Error('Invalid zip file');
    }
  }

  /**
   * Reads a ZIP file and returns the file tree without contents.
   *
   * @param {Uint8Array} zipData - The Uint8Array containing the ZIP file data.
   * @returns {any} - The file tree without contents.
   */
  public readFileTree(zipData: Uint8Array): any {
    const fileTree: any = {};

    let currentOffset = 0;

    // Find central directory file header signature
    while (currentOffset < zipData.length) {
      if (new DataView(zipData.buffer, currentOffset, 4).getUint32(0, true) === Signatures.CENTRAL_FILE_HEADER) {
        break;
      }
      currentOffset++;
    }
    // Read central directory file header
    while (currentOffset < zipData.length) {
      const signature = new DataView(zipData.buffer, currentOffset, 4).getUint32(0, true);

      if (signature === Signatures.CENTRAL_FILE_HEADER) {
        const fileNameLength = new DataView(zipData.buffer, currentOffset + 28, 2).getUint16(0, true);
        const extraFieldLength = new DataView(zipData.buffer, currentOffset + 30, 2).getUint16(0, true);
        const fileCommentLength = new DataView(zipData.buffer, currentOffset + 32, 2).getUint16(0, true);
        const fileName = new TextDecoder('utf-8').decode(
          zipData.subarray(currentOffset + 46, currentOffset + 46 + fileNameLength),
        );
        const parts = fileName.split(DirectorySignature);
        let current = fileTree;

        parts.forEach((part) => {
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        });

        currentOffset += 46 + fileNameLength + extraFieldLength + fileCommentLength;
      } else {
        break;
      }
    }

    return fileTree;
  }

  /**
   * Reads the contents of a ZIP file and constructs a hierarchical file tree with file contents.
   *
   * @param {Uint8Array} zipData - The Uint8Array containing the ZIP file data.
   * @returns {TFileTree} - The hierarchical file tree with file contents.
   */
  public readFileTreeWithContents(zipData: Uint8Array): TFileTree {
    const result: TFileTree = {};

    let currentOffset = 0;
    // Data descriptor signature
    const dataDescriptorSignature = new Uint8Array([0x50, 0x4b, 0x07, 0x08]);

    while (currentOffset < zipData.length) {
      if (new DataView(zipData.buffer, currentOffset, 4).getUint32(0, true) === Signatures.LOCAL_FILE_HEADER) {
        const fileNameLength = new DataView(zipData.buffer, currentOffset + 26, 2).getUint16(0, true);
        const extraFieldLength = new DataView(zipData.buffer, currentOffset + 28, 2).getUint16(0, true);

        const fileNameBytes = zipData.subarray(currentOffset + 30, currentOffset + 30 + fileNameLength);
        const fileName = new TextDecoder('utf-8').decode(fileNameBytes);
        const compressionMethod = new DataView(zipData.buffer, currentOffset + 8, 2).getUint16(0, true);

        if (!fileName.endsWith(DirectorySignature)) {
          const contentOffset = currentOffset + 30 + fileNameLength + extraFieldLength;

          // Check for Data Descriptor
          const dataDescriptorIndex = this.indexOfSignature(zipData, dataDescriptorSignature, contentOffset);
          // Read compressed size
          const compressedSizeFieldOffset = currentOffset + 18;
          let compressedSize = new DataView(zipData.buffer, compressedSizeFieldOffset, 4).getUint32(0, true);

          if (dataDescriptorIndex !== -1) {
            compressedSize = new DataView(zipData.buffer, dataDescriptorIndex + 8, 4).getUint32(0, true);
          }

          try {
            // Decompress the data
            const compressedData = zipData.subarray(contentOffset, contentOffset + compressedSize);
            const decompressedData = this.decompressData(compressedData, compressionMethod);

            const parts = fileName.split('/');
            let current = result;

            parts.forEach((part: string, index: number) => {
              if (!current[part]) {
                if (index === parts.length - 1) {
                  current[part] = this.decode(fileName, decompressedData);
                } else {
                  current[part] = {};
                }
              }
              if (index < parts.length - 1) {
                current = current[part] as TFileTree;
              }
            });
          } catch (error) {
            console.error(`Error decompressing ${fileName}:`, error);
            // Handle the error appropriately in your code
          }

          // Update: Use compressedSize for the offset
          currentOffset +=
            30 +
            fileNameLength +
            extraFieldLength +
            compressedSize +
            (dataDescriptorIndex > -1 ? DescriptorBytesLength : 0);
        } else {
          // Skip folders
          currentOffset += 30 + fileNameLength + extraFieldLength;
        }
      } else {
        const signature = new DataView(zipData.buffer, currentOffset, 4).getUint32(0, true);
        if (signature === Signatures.CENTRAL_FILE_HEADER) {
          break;
        }
        currentOffset += 1;
      }
    }

    return result;
  }

  private decompressData(compressedData: Uint8Array, compressionMethod: number): Uint8Array {
    switch (compressionMethod) {
      case CompressionMethods.STORE: // No compression
        return compressedData;

      case CompressionMethods.DEFLATE: // DEFLATE compression
        return pako.inflateRaw(compressedData);
      default:
        console.error(`Unsupported compression method: ${compressionMethod}`);
        return compressedData;
    }
  }

  private indexOfSignature(zipData: Uint8Array, signature: Uint8Array, offset: number): number {
    for (let i = offset; i < zipData.length - signature.length + 1; i++) {
      const isMatch = signature.every((byte, index) => zipData[i + index] === byte);
      if (isMatch) {
        return i;
      }
    }

    return -1;
  }

  private decode(fileName: string, data: Uint8Array) {
    if (BinaryFileTypes.test(fileName)) {
      const blob = URL.createObjectURL(new Blob([data], { type: getMimeType(fileName) }));
      return {
        blob,
        content: data,
      };
    }
    return {
      content: new TextDecoder('utf-8').decode(data),
    };
  }
}
