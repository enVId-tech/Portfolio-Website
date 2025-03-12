"use server"
import React from "react";
import styles from '@/styles/home.module.scss';
import DotBackground from "@/app/_components/dotbackground.tsx";

export default async function HomePage(): Promise<React.ReactElement> {
    return (
        <DotBackground config={{
            targetDotCount: 100,
            dotSize: 0.75,
            dotColor: 'rgb(200, 200, 255)',
            dotOpacity: 0.8,
            maxDistance: 120
        }}>

        </DotBackground>
    )
}