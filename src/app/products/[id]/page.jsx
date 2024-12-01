import axios from 'axios';
import Buttons from './Buttons';
import Image from 'next/image';

async function loadProduct(productId) {
    const { data } = await axios.get("http://localhost:3000/api/products/" + productId);
    return data;
}

export default async function ProductsPage({ params }) {
    const { id } = await params;

    const product = await loadProduct(id);

    return (
        <section className="flex justify-center items-center h-screen ">
            <div className="flex flex-col md:flex-row w-4/6 bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Contenedor del contenido textual */}
                <div className="p-6 w-full md:w-2/3">
                    <p className="text-xl font-bold">Name: {product.name}</p>
                    <p className="text-lg text-gray-700">Price: ${product.price}</p>
                    <p className="text-gray-600 mt-2">Description: {product.description}</p>
                    <div className="mt-4">
                        <Buttons productId={id} />
                    </div>
                </div>
                {/* Contenedor de la imagen */}
                <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                    <Image
                        src={product.image}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl md:rounded-l-none"
                    />
                </div>
            </div>
        </section>
    );
}
