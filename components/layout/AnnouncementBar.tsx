'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function AnnouncementBar() {
    const [messages, setMessages] = useState(['FREE SHIPPING ON ALL ORDERS'])
    const [currentIndex, setCurrentIndex] = useState(0)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Fetch collections to populate the announcement bar
        fetch('/api/collections')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.collections && data.collections.length > 0) {
                    const collectionMessages = data.collections.map((c: any) => c.name.toUpperCase())
                    setMessages(collectionMessages)
                }
            })
            .catch(err => console.error('Failed to fetch collections for announcement bar', err))
    }, [])

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }

    useEffect(() => {
        resetTimeout()
        timeoutRef.current = setTimeout(
            () => setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length),
            4000
        )

        return () => {
            resetTimeout()
        }
    }, [currentIndex, messages.length])

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % messages.length)
    }

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length)
    }

    if (messages.length === 0) return null

    return (
        <div className="bg-black text-white text-[10px] md:text-xs font-bold tracking-[0.2em] relative z-40 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 relative h-10 flex items-center justify-between">

                {/* Left Arrow */}
                <button
                    onClick={prev}
                    className="z-10 p-1 hover:text-gray-300 transition-colors"
                    aria-label="Previous announcement"
                >
                    <ChevronLeft size={14} strokeWidth={2} />
                </button>

                {/* Messages Container */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                    <div className="relative w-full h-full">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 flex items-center justify-center p-2 transition-all duration-700 ease-in-out transform ${index === currentIndex
                                    ? 'translate-x-0 opacity-100'
                                    : index < currentIndex
                                        ? '-translate-x-full opacity-0' // Slide out to left
                                        : 'translate-x-full opacity-0'  // Prepare on right
                                    }`}
                                aria-hidden={index !== currentIndex}
                            >
                                <span className="uppercase text-center whitespace-nowrap px-4 w-full">
                                    {msg}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    onClick={next}
                    className="z-10 p-1 hover:text-gray-300 transition-colors"
                    aria-label="Next announcement"
                >
                    <ChevronRight size={14} strokeWidth={2} />
                </button>
            </div>
        </div>
    )
}
