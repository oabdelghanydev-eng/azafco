import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Product } from '../data/products'
import { FaThermometerHalf, FaBox, FaSearchPlus } from 'react-icons/fa'
import ImageModal from './ImageModal'
import { getLocalizedField, getLocalizedArrayField, SupportedLocale } from '../utils/localization'
import { useTranslations } from 'next-intl'

interface ProductCardProps {
    product: Product
    index?: number
    showDetails?: boolean
    locale?: string
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0, showDetails = true, locale = 'ar' }) => {
    const t = useTranslations()
    const productName = getLocalizedField(product, 'name', locale)
    const productSizes = getLocalizedArrayField(product, 'sizes', locale)
    const productDescription = getLocalizedField(product, 'description', locale)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const isAr = locale === 'ar'

    // Get category label based on locale
    const getCategoryLabel = () => {
        if (product.category === 'river') {
            return t('products_page.freshwater')
        }
        return t('products_page.saltwater')
    }

    return (
        <>
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card group hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
                {/* Product Image - Clickable */}
                <div
                    className="aspect-[4/3] overflow-hidden bg-gray-200 relative cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${t('products_page.view_image')} ${productName}`}
                    onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
                >
                    <Image
                        src={product.image}
                        alt={productName}
                        width={400}
                        height={300}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        quality={75}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIRAAAgEEAQUBAAAAAAAAAAAAAQIDAAQFESESBhMxQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AyDHY+5vZ44oIJJZJGCoiLskn8Arfs/TWRxkc8cV5cRRySAB0SQKzD8IqUDQAA2P/2Q=="
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <span className={`absolute top-2 ${isAr ? 'right-2' : 'left-2'} px-2 py-1 rounded text-xs font-semibold ${product.category === 'river'
                        ? 'bg-blue-500 text-white'
                        : 'bg-cyan-500 text-white'
                        }`}>
                        {getCategoryLabel()}
                    </span>
                    {/* Zoom hint */}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
                        <FaSearchPlus className="text-xs" />
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-3 md:p-5">
                    <h3 className="text-base md:text-xl font-bold text-primary-800 mb-2">
                        {productName}
                    </h3>

                    {showDetails && (
                        <>
                            {/* Sizes */}
                            <div className="mb-3">
                                <span className="text-xs font-medium text-gray-500 block mb-1">
                                    {t('products_page.sizes_label')}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {productSizes.map((size, i) => (
                                        <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* B2B Info */}
                            <div className="flex flex-col gap-1 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <FaThermometerHalf className="text-blue-500 flex-shrink-0" />
                                    <span>{isAr ? product.storageTemp : product.storageTempEn}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaBox className="text-primary-500 flex-shrink-0" />
                                    <span>{isAr ? product.packaging : product.packagingEn}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.article>

            {/* Image Modal */}
            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageSrc={product.image}
                imageAlt={productName}
            />
        </>
    )
}

export default ProductCard

