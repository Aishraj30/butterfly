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
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
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
                                {/* More Realistic Golden Butterfly SVG */}
                                <motion.svg
                                    viewBox="0 0 100 100"
                                    className="w-full h-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <defs>
                                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#BF953F" />
                                            <stop offset="25%" stopColor="#FCF6BA" />
                                            <stop offset="50%" stopColor="#B38728" />
                                            <stop offset="75%" stopColor="#FBF5B7" />
                                            <stop offset="100%" stopColor="#AA771C" />
                                        </linearGradient>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {/* Body - Anatomically detailed */}
                                    <g fill="url(#goldGradient)" filter="url(#glow)">
                                        <circle cx="50" cy="35" r="1.5" /> {/* Head */}
                                        <ellipse cx="50" cy="45" rx="2.5" ry="6" /> {/* Thorax */}
                                        <ellipse cx="50" cy="62" rx="1.8" ry="9" /> {/* Abdomen */}
                                    </g>

                                    {/* Antennae */}
                                    <motion.g stroke="url(#goldGradient)" fill="none" strokeWidth="0.8">
                                        <path d="M49 34 C45 25 40 22 35 20" />
                                        <path d="M51 34 C55 25 60 22 65 20" />
                                    </motion.g>

                                    {/* Left Side Wings */}
                                    <motion.g
                                        style={{ transformOrigin: "50% 50%" }}
                                        animate={{ rotateY: [0, -75, 0] }}
                                        transition={{
                                            duration: 1.8,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {/* Left Forewing */}
                                        <path
                                            d="M50 42 C35 15 10 20 8 45 C7 60 30 60 50 48"
                                            fill="url(#goldGradient)"
                                            filter="url(#glow)"
                                            className="opacity-95"
                                        />
                                        {/* Wing Veins Left Top */}
                                        <path d="M50 42 C40 30 20 30 15 40" stroke="rgba(0,0,0,0.2)" fill="none" strokeWidth="0.5" />
                                        <path d="M50 44 C42 35 30 38 25 45" stroke="rgba(0,0,0,0.2)" fill="none" strokeWidth="0.5" />

                                        {/* Left Hindwing */}
                                        <path
                                            d="M50 48 C30 55 15 80 25 85 C35 90 45 70 50 55"
                                            fill="url(#goldGradient)"
                                            filter="url(#glow)"
                                            className="opacity-80"
                                        />
                                        {/* Wing Veins Left Bottom */}
                                        <path d="M50 50 C40 60 30 70 35 75" stroke="rgba(0,0,0,0.2)" fill="none" strokeWidth="0.5" />
                                    </motion.g>

                                    {/* Right Side Wings */}
                                    <motion.g
                                        style={{ transformOrigin: "50% 50%" }}
                                        animate={{ rotateY: [0, 75, 0] }}
                                        transition={{
                                            duration: 1.8,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {/* Right Forewing */}
                                        <path
                                            d="M50 42 C65 15 90 20 92 45 C93 60 70 60 50 48"
                                            fill="url(#goldGradient)"
                                            filter="url(#glow)"
                                            className="opacity-95"
                                        />
                                        {/* Wing Veins Right Top */}
                                        <path d="M50 42 C60 30 80 30 85 40" stroke="rgba(0,0,0,0.2)" fill="none" strokeWidth="0.5" />
                                        <path d="M50 44 C58 35 70 38 75 45" stroke="rgba(0,0,0,0.2)" fill="none" strokeWidth="0.5" />

                                        {/* Right Hindwing */}
                                        <path
                                            d="M50 48 C70 55 85 80 75 85 C65 90 55 70 50 55"
                                            fill="url(#goldGradient)"
                                            filter="url(#glow)"
                                            className="opacity-80"
                                        />
                                        {/* Wing Veins Right Bottom */}
                                        <path d="M50 50 C60 60 70 70 65 75" stroke="rgba(0,0,0,0.2)" fill="none" strokeWidth="0.5" />
                                    </motion.g>

                                    {/* Golden Glow Effect underneath */}
                                    <motion.ellipse
                                        cx="50"
                                        cy="95"
                                        rx="12"
                                        ry="3"
                                        fill="#BF953F"
                                        opacity="0.15"
                                        animate={{ scale: [1, 0.6, 1], opacity: [0.15, 0.05, 0.15] }}
                                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
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
