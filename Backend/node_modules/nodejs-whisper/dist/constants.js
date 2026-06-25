"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHISPER_CPP_MAIN_PATH = exports.WHISPER_CPP_PATH = exports.DEFAULT_MODEL = exports.MODEL_OBJECT = exports.MODELS = exports.MODELS_LIST = void 0;
const path_1 = __importDefault(require("path"));
exports.MODELS_LIST = [
    'tiny',
    'tiny.en',
    'base',
    'base.en',
    'small',
    'small.en',
    'medium',
    'medium.en',
    'large-v1',
    'large',
    'large-v3-turbo',
];
exports.MODELS = [
    'ggml-tiny.en.bin',
    'ggml-tiny.bin',
    'ggml-base.en.bin',
    'ggml-base.bin',
    'ggml-small.en.bin',
    'ggml-small.bin',
    'ggml-medium.en.bin',
    'ggml-medium.bin',
    'ggml-large-v1.bin',
    'ggml-large.bin',
    'ggml-large-v3-turbo.bin',
];
exports.MODEL_OBJECT = {
    tiny: 'ggml-tiny.bin',
    'tiny.en': 'ggml-tiny.en.bin',
    base: 'ggml-base.bin',
    'base.en': 'ggml-base.en.bin',
    small: 'ggml-small.bin',
    'small.en': 'ggml-small.en.bin',
    medium: 'ggml-medium.bin',
    'medium.en': 'ggml-medium.en.bin',
    'large-v1': 'ggml-large-v1.bin',
    large: 'ggml-large.bin',
    'large-v3-turbo': 'ggml-large-v3-turbo.bin',
};
exports.DEFAULT_MODEL = 'tiny.en';
exports.WHISPER_CPP_PATH = path_1.default.join(__dirname, '..', 'cpp', 'whisper.cpp');
exports.WHISPER_CPP_MAIN_PATH = process.platform === 'win32' ? 'build\\bin\\Release\\whisper-cli.exe' : './build/bin/whisper-cli';
//# sourceMappingURL=constants.js.map