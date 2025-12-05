import Image from 'next/image'
import { motion } from 'framer-motion'
import { Product } from '../data/products'

interface ProductCardProps {
    product: Product
    index?: number
    showDetails?: boolean
    locale?: 'ar' | 'en'
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0, showDetails = true, locale = 'ar' }) => {
    const isAr = locale === 'ar'
    const productName = isAr ? product.name : product.nameEn

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card group hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
        >
            <div className="aspect-[4/3] overflow-hidden bg-gray-200 relative">
                <Image
                    src={product.image}
                    alt={productName}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                        {isAr ? 'اطلب الآن' : 'Order Now'}
                    </span>
                </div>
            </div>
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-primary-800 group-hover:text-primary-600 transition-colors">
                        {productName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {product.available
                            ? (isAr ? 'متوفر' : 'Available')
                            : (isAr ? 'حسب الطلب' : 'On Request')}
                    </span>
                </div>

                {showDetails && (
                    <>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {isAr ? product.description : product.descriptionEn}
                        </p>
                        <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">
                                {isAr ? 'الأحجام المتاحة:' : 'Available Sizes:'}
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {(isAr ? product.sizes : product.sizesEn).map((size, i) => (
                                    <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                                        {size}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <a
                                href={`https://wa.me/201007514567?text=${isAr ? `أريد الاستفسار عن ${product.name}` : `I want to inquire about ${productName}`}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary text-sm py-2 px-4"
                                aria-label={isAr ? `طلب ${product.name} عبر واتساب` : `Order ${productName} via WhatsApp`}
                            >
                                {isAr ? 'طلب الآن' : 'Order Now'}
                            </a>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    )
}

export default ProductCard
