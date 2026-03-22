import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug } from '../store/productsSlice';
import { addItem } from '../store/cartSlice';
import { getImageUrl } from '../api/client';

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector((s) => s.products);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(slug));
  }, [dispatch, slug]);

  const handleAddToCart = () => {
    if (!currentProduct) return;
    dispatch(addItem({
      productId: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: getImageUrl(currentProduct.images?.[0]),
      quantity,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>;
  if (error || !currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-600">
        {error || 'Product not found'}
      </div>
    );
  }

  const mainImage = getImageUrl(currentProduct.images?.[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
          {mainImage && (
            <>
              <img src={mainImage} alt={currentProduct.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextElementSibling?.classList.remove('hidden'); }} />
              <div className="w-full h-full flex items-center justify-center text-gray-400 hidden absolute inset-0 bg-gray-100">No image</div>
            </>
          )}
          {!mainImage && <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>}
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold text-gray-800">{currentProduct.name}</h1>
          <p className="text-2xl text-primary-600 font-medium mt-2">
            ${currentProduct.price?.toLocaleString()}
            {currentProduct.compareAtPrice && (
              <span className="ml-2 text-gray-400 line-through text-lg">
                ${currentProduct.compareAtPrice.toLocaleString()}
              </span>
            )}
          </p>
          <p className="text-gray-600 mt-4">{currentProduct.description}</p>
          {(currentProduct.cut || currentProduct.color || currentProduct.clarity || currentProduct.carat) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">4Cs</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {currentProduct.cut && <li><span className="text-gray-500">Cut:</span> {currentProduct.cut}</li>}
                {currentProduct.color && <li><span className="text-gray-500">Color:</span> {currentProduct.color}</li>}
                {currentProduct.clarity && <li><span className="text-gray-500">Clarity:</span> {currentProduct.clarity}</li>}
                {currentProduct.carat != null && <li><span className="text-gray-500">Carat:</span> {currentProduct.carat}</li>}
                {currentProduct.shape && <li><span className="text-gray-500">Shape:</span> {currentProduct.shape}</li>}
                {currentProduct.metal && <li><span className="text-gray-500">Metal:</span> {currentProduct.metal}</li>}
              </ul>
            </div>
          )}
          {currentProduct.certifications?.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Certifications: {currentProduct.certifications.join(', ')}
            </p>
          )}
          <div className="mt-6 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Qty</span>
              <input
                type="number"
                min="1"
                max={currentProduct.stock || 99}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="input-field w-20"
              />
            </label>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={currentProduct.stock === 0}
              className={`btn-primary ${added ? 'bg-green-600' : ''}`}
            >
              {added ? 'Added to cart' : 'Add to cart'}
            </button>
          </div>
          {currentProduct.stock != null && currentProduct.stock <= 5 && currentProduct.stock > 0 && (
            <p className="mt-2 text-sm text-amber-600">Only {currentProduct.stock} left</p>
          )}
        </div>
      </div>
    </div>
  );
}
