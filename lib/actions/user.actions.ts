'use server';

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

// Check if Appwrite is configured
const isAppwriteConfigured = () => {
    return !!(
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT &&
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT
    );
};

export const signIn = async ({ email, password }: signInProps) => {
    try {
        if (!isAppwriteConfigured()) {
            // Demo fallback: Allow sign-in with any valid email and 8+ character password
            if (email && password && password.length >= 8) {
                const mockUser = {
                    $id: "user_mock",
                    email: email,
                    userId: "user_mock",
                    firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) || "Demo",
                    lastName: "User",
                    address1: "123 Main St",
                    city: "Mumbai",
                    state: "Maharashtra",
                    postalCode: "400001",
                    dateOfBirth: "1995-01-01",
                    ssn: "1234",
                };
                
                (await cookies()).set("finman-demo-session", JSON.stringify(mockUser), {
                    path: "/",
                    httpOnly: true,
                    sameSite: "strict",
                    secure: true,
                });
                return parseStringify(mockUser);
            }
            return null;
        }

        const { account } = await createAdminClient();
        const response = await account.createEmailPasswordSession(email, password);
        
        (await cookies()).set("appwrite-session", response.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(response);
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export const signUp = async (userData: SignUpParams) => {
    const { email, password, firstName, lastName, address1, city, state, postalCode, dateOfBirth, ssn } = userData;
    
    try {
        if (!isAppwriteConfigured()) {
            // Demo fallback: Create and sign in demo user
            const mockUser = {
                $id: "user_mock_" + Date.now(),
                email,
                userId: "user_mock_" + Date.now(),
                firstName,
                lastName,
                address1: address1 || "123 Main St",
                city: city || "Mumbai",
                state: state || "Maharashtra",
                postalCode: postalCode || "400001",
                dateOfBirth: dateOfBirth || "1995-01-01",
                ssn: ssn || "1234",
            };

            (await cookies()).set("finman-demo-session", JSON.stringify(mockUser), {
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            });
            return parseStringify(mockUser);
        }

        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(), 
            email, 
            password, 
            `${firstName} ${lastName}`
        );

        const session = await account.createEmailPasswordSession(email, password);

        (await cookies()).set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });

        return parseStringify(newUserAccount);
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export const getLoggedInUser = async () => {
    try {
        if (!isAppwriteConfigured()) {
            const demoSession = (await cookies()).get("finman-demo-session");
            if (demoSession) {
                try {
                    return parseStringify(JSON.parse(demoSession.value));
                } catch {
                    return null;
                }
            }
            return null;
        }

        const client = await createSessionClient();
        if(!client) return null;
        
        const { account } = client;
        const user = await account.get();
        return parseStringify(user);
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const logoutAccount = async () => {
    try {
        if (!isAppwriteConfigured()) {
            (await cookies()).delete('finman-demo-session');
            return true;
        }

        const client = await createSessionClient();
        if(!client) return null;

        const { account } = client;
        (await cookies()).delete('appwrite-session');
        await account.deleteSession('current');
        return true;
    } catch {
        return null;
    }
}

