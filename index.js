#!/usr/bin/env node
require('dotenv').config();
const { BlobServiceClient } = require("@azure/storage-blob");

// Creación de conexión
const storageAccountConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnectionString);

async function main() {
    // Creación de contenedores(carpetas dentro de Azure Files)
    // Crea el contenedor, solo si no existe
    const containerName = 'archivos'; // ! solo minusculas
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const containerExists = await containerClient.exists()
    if (!containerExists) {
        const createContainerResponse = await containerClient.createIfNotExists();
        console.log(`Create container ${containerName} successfully`, createContainerResponse.succeeded);
    }
    else {
        console.log(`Container ${containerName} already exists`);
    }

    // Subida de archivo
    const filename = 'img\\gunter 2.jpg';
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    blockBlobClient.uploadFile(filename);

    // Listar blobs de los contenedores
    let blobs = containerClient.listBlobsFlat();
    for await (const blob of blobs) {
        console.log(`${blob.name} --> Created: ${blob.properties.createdOn}   Size: ${blob.properties.contentLength}`);
    }

    console.log('Hello, World!');

}

main();