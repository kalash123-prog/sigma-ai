import { Logger } from './types';
export declare const checkIfFileExists: (filePath: string) => void;
export declare const convertToWavType: (inputFilePath: string, logger?: Logger) => Promise<string>;
