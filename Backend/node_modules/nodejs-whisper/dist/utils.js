"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToWavType = exports.checkIfFileExists = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const checkIfFileExists = (filePath) => {
    if (!fs_1.default.existsSync(filePath)) {
        throw new Error(`[Nodejs-whisper] Error: No such file: ${filePath}`);
    }
};
exports.checkIfFileExists = checkIfFileExists;
function isValidWavHeader(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const readable = fs_1.default.createReadStream(filePath, { end: 43 });
            let data = Buffer.alloc(0);
            readable.on('data', (chunk) => {
                data = Buffer.concat([data, chunk]);
            });
            readable.on('end', () => {
                const isWav = data.toString('binary', 0, 4) === 'RIFF' || data.toString('binary', 0, 4) === 'RIFX';
                if (!isWav) {
                    resolve(false);
                    return;
                }
                if (data.length >= 28) {
                    const sampleRate = data.readUInt32LE(24);
                    resolve(sampleRate === 16000);
                }
                else {
                    resolve(false);
                }
            });
            readable.on('error', err => reject(err));
        });
    });
}
const convertToWavType = (inputFilePath_1, ...args_1) => __awaiter(void 0, [inputFilePath_1, ...args_1], void 0, function* (inputFilePath, logger = console) {
    const fileExtension = path_1.default.extname(inputFilePath).toLowerCase();
    logger.debug(`[Nodejs-whisper] Checking if the file is a valid WAV: ${inputFilePath}`);
    if (fileExtension === '.wav') {
        const isWav = yield isValidWavHeader(inputFilePath);
        if (isWav) {
            logger.debug(`[Nodejs-whisper] File is a valid WAV file.`);
            return inputFilePath;
        }
        else {
            logger.debug(`[Nodejs-whisper] File has a .wav extension but is not a valid WAV, overwriting...`);
            // Use a temporary file to avoid overwrite conflicts
            const tempFile = inputFilePath + '.temp.wav';
            const command = `ffmpeg -nostats -loglevel error -y -i "${inputFilePath}" -ar 16000 -ac 1 -c:a pcm_s16le "${tempFile}"`;
            const result = shelljs_1.default.exec(command);
            if (result.code !== 0) {
                throw new Error(`[Nodejs-whisper] Failed to convert audio file: ${result.stderr}`);
            }
            fs_1.default.renameSync(tempFile, inputFilePath);
            return inputFilePath;
        }
    }
    else {
        // Convert to a new WAV file
        const outputFilePath = path_1.default.join(path_1.default.dirname(inputFilePath), `${path_1.default.basename(inputFilePath, fileExtension)}.wav`);
        logger.debug(`[Nodejs-whisper] Converting to a new WAV file: ${outputFilePath}`);
        const command = `ffmpeg -nostats -loglevel error -y -i "${inputFilePath}" -ar 16000 -ac 1 -c:a pcm_s16le "${outputFilePath}"`;
        const result = shelljs_1.default.exec(command);
        if (result.code !== 0) {
            throw new Error(`[Nodejs-whisper] Failed to convert audio file: ${result.stderr}`);
        }
        return outputFilePath;
    }
});
exports.convertToWavType = convertToWavType;
//# sourceMappingURL=utils.js.map