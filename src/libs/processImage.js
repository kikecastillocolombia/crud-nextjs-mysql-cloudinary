import { writeFile } from 'fs/promises'
import path from 'path'

async function processImage(image) {
    // Procesar la imagen
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(process.cwd(), 'public', imageFile.name);
    await writeFile(filePath, buffer);
    return filePath;
}

export default processImage;