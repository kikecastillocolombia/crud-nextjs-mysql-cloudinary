import { conn } from '../../../../libs/mysql';
import { NextResponse } from 'next/server';
import cloudinary from '../../../../libs/cloudinary';

// Obtener un producto por ID
export async function GET(request, { params }) {
    try {
        const { id } = await params;  // Extraemos directamente el id de los params
        const result = await conn.query('SELECT * FROM product WHERE id = ?', [id]);

        if (result.length === 0) {
            return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
        }
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Error GET:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// Subir imagen a Cloudinary
async function uploadImage(image) {
    try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        return uploadResponse.secure_url;
    } catch (error) {
        throw new Error("Error al subir la imagen a Cloudinary");
    }
}

// Actualizar un producto por ID
export async function PUT(request, { params }) {
    try {
        const id = await params.id;
        if (!id) {
            return new Response("ID no proporcionado", { status: 400 });
        }

        // Obtener los datos del FormData
        const formData = await request.formData();

        // Verificar si los campos obligatorios están presentes
        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");
        const image = formData.get("image");

        if (!name || !price || !description) {
            return new Response("Faltan campos obligatorios: name, price o description", { status: 400 });
        }

        // Si se proporcionó una imagen, se sube a Cloudinary
        let imageUrl = null;
        if (image) {
            imageUrl = await uploadImage(image);  // Subir la imagen a Cloudinary y obtener la URL
        }

        // Llamar a la función para actualizar el producto en la base de datos
        const updatedProduct = await updateProductInDB(id, { name, price, description, imageUrl });

        return new Response(JSON.stringify(updatedProduct), { status: 200 });
    } catch (error) {
        console.error("Error PUT:", error.message);
        return new Response(`Error interno del servidor: ${error.message}`, { status: 500 });
    }
}

// Actualizar producto en la base de datos
async function updateProductInDB(id, productData) {
    try {
        const [result] = await conn.query(
            "UPDATE product SET name = ?, price = ?, description = ?, image = ? WHERE id = ?",
            [
                productData.name,
                productData.price,
                productData.description,
                productData.imageUrl || null, // Si no hay imagen, se pone null
                id,
            ]
        );

        if (result.affectedRows === 0) {
            throw new Error("Producto no encontrado");
        }

        return { id, ...productData };
    } catch (error) {
        console.error("Error al actualizar en la base de datos:", error);
        throw new Error("Error en la base de datos");
    }
}

// Eliminar producto por ID
export async function DELETE(request, { params }) {
    const { id } = params;  // Extraemos el id directamente

    try {
        const [result] = await conn.query('DELETE FROM product WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
        }

        return new Response(null, { status: 204 }); // Retornar No Content
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}
