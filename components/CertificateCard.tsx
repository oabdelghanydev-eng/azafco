import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaExpandAlt } from 'react-icons/fa'
import { Certificate } from '../data/certificates'

interface CertificateCardProps {
    certificate: Certificate
    index?: number
    onImageClick?: (image: string) => void
}

const CertificateCard: React.FC<CertificateCardProps> = ({
    certificate,
    index = 0,
    onImageClick
}) => {
    const handleClick = () => {
        if (onImageClick) {
            onImageClick(certificate.image)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="card group hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
            onClick={handleClick}
        >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <Image
                    src={certificate.image}
                    alt={certificate.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-primary-900/70 via-primary-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center"
                >
                    <FaExpandAlt className="text-white text-4xl mb-2" />
                    <span className="text-white font-semibold">اضغط للتكبير</span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-primary-800 group-hover:text-primary-600 transition-colors">{certificate.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{certificate.description}</p>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">الجهة: {certificate.issuer}</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        صالحة حتى {certificate.validUntil}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

export default CertificateCard
