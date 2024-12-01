import Image from "next/image";
import Link from "next/link";

function ProductCard({ product }) {
    return (
        <Link
            href={`/products/${product.id}`}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
        >
            {product.image ? (
                <div className="w-full h-48 relative">
                    <Image
                        src={product.image}
                        alt="Imagen del producto"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                    />
                </div>
            ) : (
                <div className="w-full h-48 bg-gray-200 flex justify-center items-center rounded-t-lg">
                    <p className="text-gray-500">No hay imagen disponible</p>
                </div>
            )}

            <div className="p-4">
                <h3 className="text-2xl font-bold mb-3">{product.name}</h3>
                <h2 className="text-4xl text-slate-600 mt-2">${product.price}</h2>
                <p className="text-gray-500 mt-2">{product.description}</p>
            </div>
        </Link>
    );
}

export default ProductCard;
