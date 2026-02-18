'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ButterflyLoaderProps {
    isLoading: boolean
}

export function ButterflyLoader({ isLoading }: ButterflyLoaderProps) {
    const [show, setShow] = useState(isLoading)

    useEffect(() => {
        if (isLoading) {
            setShow(true)
        } else {
            const timer = setTimeout(() => setShow(false), 1000) // Stay visible briefly after load
            return () => clearTimeout(timer)
        }
    }, [isLoading])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black overflow-hidden"
                >
                    <div className="relative">
                        {/* The Butterfly Logo Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [0.8, 1.1, 1],
                                opacity: 1
                            }}
                            transition={{
                                duration: 1.5,
                                ease: "easeOut"
                            }}
                            className="relative z-10 flex flex-col items-center"
                        >
                            <div className="w-40 h-40 flex items-center justify-center">
                                {/* Realistic Golden Butterfly SVG */}
                                <motion.svg
                                    viewBox="0 0 100 100"
                                    className="w-full h-full"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <defs>
                                        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#BF953F" />
                                            <stop offset="25%" stopColor="#FCF6BA" />
                                            <stop offset="50%" stopColor="#B38728" />
                                            <stop offset="75%" stopColor="#FBF5B7" />
                                            <stop offset="100%" stopColor="#AA771C" />
                                        </linearGradient>
                                    </defs>

                                    {/* Left Side Wings */}
                                    <motion.g
                                        style={{ transformOrigin: "50% 50%" }}
                                        animate={{
                                            rotateY: [0, -75, 0],
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            ease: [0.45, 0.05, 0.55, 0.95]
                                        }}
                                    >
                                        {/* Left Forewing - Overlapping Body */}
                                        <path
                                            d="M51 42 C30 10 5 15 5 45 C5 60 25 60 51 48"
                                            fill="url(#gold-gradient)"
                                            stroke="#8B6914"
                                            strokeWidth="0.1"
                                        />
                                        <path d="M51 42 C40 30 25 30 15 35 M51 44 C35 40 20 40 10 45 M51 46 C35 50 25 55 15 55" fill="none" stroke="black" strokeWidth="0.05" opacity="0.2" />

                                        {/* Left Hindwing - Overlapping Body */}
                                        <path
                                            d="M51 48 C30 55 10 80 20 85 C30 90 45 70 51 55"
                                            fill="url(#gold-gradient)"
                                            stroke="#8B6914"
                                            strokeWidth="0.1"
                                            opacity="0.95"
                                        />
                                        <path d="M51 50 C40 65 30 75 25 75 M51 53 C45 70 40 80 35 80" fill="none" stroke="black" strokeWidth="0.05" opacity="0.2" />
                                    </motion.g>

                                    {/* Right Side Wings */}
                                    <motion.g
                                        style={{ transformOrigin: "50% 50%" }}
                                        animate={{
                                            rotateY: [0, 75, 0],
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            ease: [0.45, 0.05, 0.55, 0.95]
                                        }}
                                    >
                                        {/* Right Forewing - Overlapping Body */}
                                        <path
                                            d="M49 42 C70 10 95 15 95 45 C95 60 75 60 49 48"
                                            fill="url(#gold-gradient)"
                                            stroke="#8B6914"
                                            strokeWidth="0.1"
                                        />
                                        <path d="M49 42 C60 30 75 30 85 35 M49 44 C65 40 80 40 90 45 M49 46 C65 50 75 55 85 55" fill="none" stroke="black" strokeWidth="0.05" opacity="0.2" />

                                        {/* Right Hindwing - Overlapping Body */}
                                        <path
                                            d="M49 48 C70 55 90 80 80 85 C70 90 55 70 49 55"
                                            fill="url(#gold-gradient)"
                                            stroke="#8B6914"
                                            strokeWidth="0.1"
                                            opacity="0.95"
                                        />
                                        <path d="M49 50 C60 65 70 75 75 75 M49 53 C55 70 60 80 65 80" fill="none" stroke="black" strokeWidth="0.05" opacity="0.2" />
                                    </motion.g>

                                    {/* Body Group - Placed over wings to hide joints */}
                                    <motion.g
                                        fill="url(#gold-gradient)"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <circle cx="50" cy="35" r="1.8" /> {/* Head */}
                                        <ellipse cx="50" cy="45" rx="2.5" ry="6.5" /> {/* Thorax */}
                                        <ellipse cx="50" cy="62" rx="1.8" ry="11" /> {/* Abdomen */}

                                        {/* Antennae */}
                                        <g fill="none" stroke="#D4AF37" strokeWidth="0.6">
                                            <path d="M49 33.5 C45 25 40 22 35 20" />
                                            <path d="M51 33.5 C55 25 60 22 65 20" />
                                        </g>
                                    </motion.g>

                                    {/* Golden Reflection */}
                                    <motion.ellipse
                                        cx="50"
                                        cy="95"
                                        rx="12"
                                        ry="2"
                                        fill="#D4AF37"
                                        opacity="0.1"
                                        animate={{
                                            scale: [1, 0.6, 1],
                                            opacity: [0.1, 0.05, 0.1]
                                        }}
                                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </motion.svg>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
