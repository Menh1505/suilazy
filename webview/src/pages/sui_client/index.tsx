"use client"

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function SuiClient() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/client/help");
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black">
            <main className="p-0">
                <Outlet />
            </main>
        </div>
    );
}