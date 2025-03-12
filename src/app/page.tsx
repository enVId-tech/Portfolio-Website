"use server"
import React from "react";
import DotBackground from "@/app/_components/dotbackground";
import Header from "@/app/_components/header";

export default async function HomePage(): Promise<React.ReactElement> {
    return (
        <DotBackground config={{
            spacingBetweenDots: 40,
            dotSize: 1,
            dotColor: 'rgb(200, 200, 255)',
            dotOpacity: 0.3,
            maxDistance: 150,
            friction: 0.5, // WARNING: Do NOT use values greater than 0.8.
        }}>
            <Header/>
        </DotBackground>
    )
}