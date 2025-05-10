"use client"

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function SuiMove() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/move/help");
    }, [navigate]);

    return (
        <div className="min-h-screen bg-vscode-background">
            <main className="p-0">
                <Outlet />
            </main>
        </div>
    );
}