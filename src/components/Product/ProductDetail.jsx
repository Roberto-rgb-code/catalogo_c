import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts, fetchStocks } from "../../services/api.js";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, stocksData] = await Promise.all([
          fetchProducts(),
          fetchStocks()
        ]);

        const stocksMap = stocksData.reduce((acc, stock) => {
          acc[stock.Material] = stock.Stock;
          return acc;
        }, {});

        const foundProduct = productsData.find(p => p.skuPadre === id);
        
        if (foundProduct) {
          setProduct({
            id: foundProduct.skuPadre,
            name: foundProduct.nombrePadre,
            images: [
              ...foundProduct.imagenesPadre,
              ...foundProduct.hijos[0]?.imagenesHijo || []
            ],
            description: foundProduct.descripcion,
            category: foundProduct.categorias,
            tipo: foundProduct.hijos[0]?.tipo || '',
            stock: stocksMap[foundProduct.skuPadre] || 0,
            details: {
              descripcion: foundProduct.descripcion,
              categoria: foundProduct.categorias,
              tamanoProducto: foundProduct.paquete?.medidas || "1 x 14",
              tamanoCaja: foundProduct.paquete?.medidas || "",
              piezasPorCaja: foundProduct.paquete?.PiezasCaja || "",
              tecnicaImpresion: foundProduct.impresion?.tecnicaImpresion || "",
              areaImpresion: foundProduct.impresion?.areaImpresion || ""
            }
          });

          // Obtener productos relacionados
          const related = productsData
            .filter(p => p.categorias === foundProduct.categorias && p.skuPadre !== id)
            .slice(0, 6)
            .map(p => ({
              id: p.skuPadre,
              name: p.nombrePadre,
              imageUrl: p.imagenesPadre[0],
              tipo: p.hijos?.[0]?.tipo || '',
              stock: stocksMap[p.skuPadre] || 0
            }));
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#242964]"></div>
    </div>
  );

  if (!product) return (
    <div className="text-center p-8">Producto no encontrado</div>
  );

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div>
          <div className="aspect-square mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, index) => (
              <div 
                key={index}
                className={`aspect-square border p-1 cursor-pointer 
                  ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <h2 className="font-semibold mt-6 mb-4">Colores disponibles</h2>

          <h2 className="font-semibold mt-6 mb-4">Detalles De Producto</h2>
          <div className="bg-gray-50 p-6 rounded">
            {Object.entries(product.details).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 gap-4 mb-2">
                <span className="font-medium capitalize">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span>{value}</span>
              </div>
            ))}
          </div>

          {/* Stock */}
          <div className="mt-4">
            <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin existencias'}
            </p>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">PRODUCTOS RELACIONADOS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {relatedProducts.map(relatedProduct => (
              <Link 
                to={`/promocionales/product/${relatedProduct.id}`} 
                key={relatedProduct.id}
                className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square mb-4">
                  <img
                    src={relatedProduct.imageUrl}
                    alt={relatedProduct.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible';
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-sm mb-1">{relatedProduct.name}</h3>
                  <p className="text-sm text-gray-600">{relatedProduct.tipo}</p>
                  <p className={`text-sm ${relatedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {relatedProduct.stock > 0 ? `Stock: ${relatedProduct.stock}` : 'Sin existencias'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;