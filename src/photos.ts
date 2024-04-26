import { readdir } from "node:fs/promises";
import path from 'node:path';


interface PhotoConfig {
    fileName: string,
    createDate: string,
    createSecondsEpoc: number,
    trigger: "Time" | "External" | "Trigger",
    subjectDistance: number,
    exposureTime: string,
    ISO: number
}

function parsePhotoConfig(contents: any) {

    const photoConfig: PhotoConfig = {
        fileName: contents["File Name"],
        createDate: contents["Create Date"],
        createSecondsEpoc: contents["Create Seconds Epoch"],
        trigger: contents["Trigger"],
        subjectDistance: contents["Subject Distance"],
        exposureTime: contents["Exposure Time"],
        ISO: contents["ISO"],
      };

    return photoConfig
} 

async function readPhotoConfig(filePath: string) {
    const file = Bun.file(filePath);
    const contents = await file.json();
}


export async function readPhotosFromPublicDirectory() {

    const directory = "./public/photos/"

    const files = await readdir(directory, { recursive: true });
    const jsonFiles = files
        .filter(filePath => filePath.endsWith('.json'))
        .map(filepath => path.join("/", directory, filepath))
        .map(async filePath => readPhotoConfig(filePath))
        .map(content => parsePhotoConfig(content))

    

    console.log(jsonFiles)


    return jsonFiles
}

readPhotosFromPublicDirectory()