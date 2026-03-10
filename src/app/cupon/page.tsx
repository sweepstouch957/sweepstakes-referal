"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getStoreBySlug } from "@/services/store.service";
import Navbar from "../win-a-car/components/Navbar"; // Reusing navbar
import Footer from "../win-a-car/components/Footer"; // Reusing footer
import { Container, Skeleton, Box, Typography } from "@mui/material";
import { Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// --- MOCK DATA ---
// Removed mock data for now.

// --- COMPONENTS ---

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
                                    <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden shadow-2xl ring-8 ring-indigo-50 border-4 border-white z-10 flex items-center justify-center bg-white">
                                        <Image
                                            src={store.image}
                                            alt={`${store.name} logo`}
                                            fill
                                            style={{ objectFit: "contain", padding: "16px" }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-48 h-48 mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl ring-8 ring-indigo-50 border-4 border-white z-10">
                                        <Typography variant="h2" className="text-white font-bold">
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

                    {/* Coming Soon Section */}
                    {(store || !slug) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
                            </div>

                            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full mb-6">
                                <svg className="w-10 h-10 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>

                            <Typography variant="h3" className="font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4">
                                ¡Los cupones están llegando!
                            </Typography>
                            <Typography variant="h6" className="text-gray-500 font-medium max-w-2xl mx-auto">
                                Estamos trabajando para traerte las mejores ofertas y descuentos exclusivos para tu tienda favorita. Vuelve pronto para descubrirlos.
                            </Typography>
                        </motion.div>
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
