import { NextResponse } from 'next/server'
import { conn } from '../../../libs/mysql';
import cloudinary from '../../../libs/cloudinary';
import { unlink } from 'fs/promises'
import processImage from '../../../libs/processImage';

    export async function GET() {
    try {
        const results = await conn.query('SELECT * FROM product')
        return NextResponse.json(results)
    } catch (error) {
        return NextResponse.json({
            message: error.message
        }, {
            status: 500
        })
    }
}

export async function POST(request) {
    try {
        const data = await request.formData();
        
        // Obtener los datos del formulario
        const name = data.get('name');
        const description = data.get('description');
        const price = data.get('price');
        const imageFile = data.get('image');

        // Validar los datos
        if (!name || !description || !price || !imageFile) {
            return NextResponse.json({
                message: 'Todos los campos son obligatorios, incluyendo la imagen.'
            }, { status: 400 });
        }

        const filePath = await processImage(imageFile);
        console.log('Ruta del archivo:', filePath)

        // Subir la imagen a Cloudinary
        const res = await cloudinary.uploader.upload(filePath);
        const imageUrl = res.secure_url; // Ahora esto está definido correctamente
        if (res) {
            await unlink(filePath);
        }

        // Guardar los datos del producto en la base de datos
        const result = await conn.query(
            'INSERT INTO product (name, description, price, image) VALUES (?, ?, ?, ?)',
            [name, description, price, imageUrl]
        );

        // Responder con los datos insertados
        return NextResponse.json({
            id: result.insertId,
            name,
            description,
            price,
            image: imageUrl
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);

        return NextResponse.json({
            message: error.message
        }, { status: 500 });
    }
}

