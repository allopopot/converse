"use client"
import { useAuthSession } from "@/hooks/auth"
import { LoaderPinwheel } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function () {
    const { isLoading, session, user } = useAuthSession()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push("/")
        }
    }, [isLoading])
    return (isLoading ?
        <div className="absolute h-dvh w-dvw z-100 bg-background flex flex-col items-center-safe justify-center-safe gap-4">
            <p className="text-3xl italic font-semibold">Loading...</p>
            <LoaderPinwheel className="animate-spin"></LoaderPinwheel>
        </div> : null
    )
}