'use client';

interface CatalogBannerProps {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
}

export function CatalogBanner({ title, subtitle, backgroundImage }: CatalogBannerProps = {}) {
    return (
        <div 
            className="w-full py-24 px-5 text-center relative border-b border-gray-200 h-96"
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="relative z-10 max-w-[1400px] mx-auto pt-16">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-serif text-red-600 italic">
                        Discover
                    </h2>
                    <h3 className="text-xl md:text-2xl font-sans font-semibold uppercase tracking-wider text-white">
                        {title || 'OUTERWEAR'}
                    </h3>
                    {subtitle && (
                        <p className="text-lg text-white mt-2">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
