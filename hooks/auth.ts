import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function useAuthSession() {
    const [user, setUser] = useState<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
    }>()
    const [session, setSession] = useState<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
    }>()
    const [isLoading, setIsLoading] = useState(false)


    async function sessionBootstrap() {
        setIsLoading(true)
        let authResponse = await authClient.getSession()
        if (authResponse.data) {
            setUser(authResponse.data.user)
            setSession(authResponse.data.session)
        }
        setIsLoading(false)
    }
    useEffect(() => {
        sessionBootstrap()
    }, [])
    return {
        user, session, isLoading
    }
}