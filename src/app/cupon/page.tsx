"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getStoreBySlug } from "@/services/store.service";
import Navbar from "../win-a-car/components/Navbar"; // Reusing navbar
import Footer from "../win-a-car/components/Footer"; // Reusing footer
import { Container, Skeleton, Box, Typography, Grid } from "@mui/material";
import { Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// --- MOCK DATA ---
const MOCK_COUPONS = [
    {
        id: 1,
        title: "15% Off Any Oil Change",
        description: "Valid for synthetic and conventional oil changes.",
        code: "OIL15OFF",
        expiresAt: "2026-12-31",
        color: "from-blue-500 to-cyan-400",
    },
    {
        id: 2,
        title: "Free Tire Rotation",
        description: "With the purchase of any set of 4 new tires.",
        code: "FREETIRES",
        expiresAt: "2026-10-15",
        color: "from-emerald-500 to-teal-400",
    },
    {
        id: 3,
        title: "$50 Off Brake Service",
        description: "Includes front or rear pad replacement and rotor resurfacing.",
        code: "BRAKE50",
        expiresAt: "2026-11-30",
        color: "from-rose-500 to-red-600",
    },
    {
        id: 4,
        title: "10% Off All Accessories",
        description: "Floor mats, wipers, air fresheners, and more.",
        code: "ACC10",
        expiresAt: "2026-09-01",
        color: "from-violet-500 to-purple-500",
    },
];

// --- COMPONENTS ---

function CouponCard({ coupon }: { coupon: typeof MOCK_COUPONS[0] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative overflow-hidden rounded-2xl shadow-xl transition-shadow hover:shadow-2xl bg-gradient-to-br ${coupon.color} text-white p-1`}
        >
            <div className="relative h-full w-full rounded-xl bg-black/10 backdrop-blur-sm p-6 flex flex-col justify-between">
                {/* Decorative Circles */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-black/20 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <Typography
                        variant="overline"
                        className="font-bold tracking-widest text-white/80"
                    >
                        Limited Time Offer
                    </Typography>
                    <Typography
                        variant="h5"
                        className="font-extrabold mt-1 mb-2 leading-tight drop-shadow-md text-[28px]"
                    >
                        {coupon.title}
                    </Typography>
                    <Typography variant="body2" className="text-white/90 mb-6 font-medium">
                        {coupon.description}
                    </Typography>
                </div>

                <div className="relative z-10 mt-auto pt-4 border-t border-white/20 flex items-center justify-between">
                    <div>
                        <Typography variant="caption" className="block text-white/70 uppercase">
                            Promo Code
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            className="font-mono font-bold tracking-widest bg-black/20 px-3 py-1 rounded-md inline-block mt-1"
                        >
                            {coupon.code}
                        </Typography>
                    </div>
                    <div className="text-right">
                        <Typography variant="caption" className="block text-white/70 uppercase">
                            Expires
                        </Typography>
                        <Typography variant="subtitle2" className="font-semibold">
                            {new Date(coupon.expiresAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </Typography>
                    </div>
                </div>

                {/* Perforated Edge Effect (CSS) */}
                <div className="absolute top-0 bottom-0 -left-3 w-6 flex flex-col justify-evenly">
                    {[...Array(6)].map((_, i) => (
                        <div key={`l-${i}`} className="w-4 h-4 rounded-full bg-white shadow-inner"></div>
                    ))}
                </div>
                <div className="absolute top-0 bottom-0 -right-3 w-6 flex flex-col justify-evenly">
                    {[...Array(6)].map((_, i) => (
                        <div key={`r-${i}`} className="w-4 h-4 rounded-full bg-white shadow-inner"></div>
                    ))}
                </div>

            </div>
        </motion.div>
    );
}

function CouponContent() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug") || "";

    const { data: store, isLoading } = useQuery({
        queryKey: ["store", slug],
        queryFn: () => getStoreBySlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    });

    return (
        <Box className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <Container maxWidth="lg">
                    {/* Store Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12 flex flex-col items-center justify-center text-center relative overflow-hidden"
                    >
                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>

                        {isLoading ? (
                            <>
                                <Skeleton variant="circular" width={100} height={100} sx={{ mb: 2 }} />
                                <Skeleton width={200} height={40} sx={{ mb: 1 }} />
                                <Skeleton width={300} height={24} />
                            </>
                        ) : store ? (
                            <>
                                {store.image ? (
                                    <div className="relative w-32 h-32 mb-6 rounded-2xl overflow-hidden shadow-lg border-4 border-white z-10">
                                        <Image
                                            src={store.image}
                                            alt={`${store.name} logo`}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg border-4 border-white z-10">
                                        <Typography variant="h3" className="text-white font-bold">
                                            {store.name.charAt(0).toUpperCase()}
                                        </Typography>
                                    </div>
                                )}
                                <Typography variant="h3" className="font-extrabold text-gray-900 mb-2 z-10">
                                    {store.name}
                                </Typography>
                                <Typography variant="h6" className="text-gray-500 font-medium max-w-2xl z-10">
                                    Exclusive Deals & Offers Just For You
                                </Typography>
                            </>
                        ) : slug ? (
                            <Typography variant="h5" color="error">
                                Store not found.
                            </Typography>
                        ) : (
                            <Typography variant="h5" color="text.secondary">
                                Please provide a store slug in the URL (e.g., ?slug=mystore).
                            </Typography>
                        )}
                    </motion.div>

                    {/* Coupons Grid Section */}
                    {(store || !slug) && (
                        <Box>
                            <div className="flex items-center justify-between mb-8">
                                <Typography variant="h4" className="font-bold text-gray-800">
                                    Available Offers
                                </Typography>
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {MOCK_COUPONS.length} Deals
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                                {MOCK_COUPONS.map((coupon, index) => (
                                    <div key={coupon.id}>
                                        <CouponCard coupon={coupon} />
                                    </div>
                                ))}
                            </div>
                        </Box>
                    )}

                </Container>
            </main>

            <Footer />
        </Box>
    );
}

export default function CouponPage() {
    return (
        <Suspense
            fallback={
                <Box className="min-h-screen bg-gray-50 flex flex-col">
                    <Navbar />
                    <Container maxWidth="lg" sx={{ py: 12 }}>
                        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4, mb: 6 }} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i}>
                                    <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 4 }} />
                                </div>
                            ))}
                        </div>
                    </Container>
                </Box>
            }
        >
            <CouponContent />
        </Suspense>
    );
}
