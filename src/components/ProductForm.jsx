"use client";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

function ProductForm() {
  const [product, setProduct] = useState({
    name: "",
    price: "00.00",
    description: "",
  });
  const [file, setFile] = useState(null);
  const router = useRouter();
  const params = useParams();

  // Actualizar estado del producto al escribir en el formulario
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // Cargar producto si existe un ID en la URL
  useEffect(() => {
    if (params.id) {
      (async () => {
        try {
          const { data } = await axios.get(`/api/products/${params.id}`);
          if (data) setProduct(data);
          else console.warn("Producto no encontrado:", params.id);
        } catch (error) {
          console.error("Error al cargar el producto:", error.message);
        }
      })();
    }
  }, [params.id]);

  // Limpiar URL de vista previa del archivo al desmontar el componente
  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file);
    };
  }, [file]);

  // Validar datos del formulario
  const validateForm = () => {
    if (!product.name || !product.description || !product.price) {
      alert("Por favor, completa todos los campos.");
      return false;
    }

    if (isNaN(Number(product.price))) {
      alert("El precio debe ser un número válido.");
      return false;
    }

    return true;
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    if (file) formData.append("image", file);

    try {
      const headers = { "Content-Type": "multipart/form-data" };

      if (params.id) {
        // Actualizar producto existente
        await axios.put(`/api/products/${params.id}`, formData, { headers: {
            "Content-Type": "multipart/form-data"
        } });
      } else {
        // Crear nuevo producto
        await axios.post("/api/products", formData, { headers: {
            "Content-Type": "multipart/form-data"
        } });
      }

      // Redirigir tras éxito
      router.push("/products");
    } catch (error) {
      console.error("Error al enviar el formulario:", error.message);
    }
  };

  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={handleSubmit}
    >
      {/* Nombre del producto */}
      <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
        Product Name
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="name"
        name="name"
        placeholder="Product Name"
        onChange={handleChange}
        value={product.name}
        autoFocus
      />

      {/* Precio del producto */}
      <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
        Product Price
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="price"
        name="price"
        placeholder="00.00"
        onChange={handleChange}
        value={product.price}
      />

      {/* Descripción del producto */}
      <label
        htmlFor="description"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Product Description
      </label>
      <textarea
        rows={3}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="description"
        name="description"
        placeholder="Product Description"
        onChange={handleChange}
        value={product.description}
      ></textarea>

      {/* Imagen del producto */}
      <label
        htmlFor="productImage"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Product Image:
      </label>
      <input
        type="file"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        id="productImage"
        name="productImage"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* Vista previa de la imagen */}
      {file && (
        <Image
          src={URL.createObjectURL(file)}
          alt="Product Image"
          width={300}
          height={200}
        />
      )}

      {/* Botón de envío */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {params.id ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}

export default ProductForm;
