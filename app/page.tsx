"use client"

import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import dynamic from 'next/dynamic'
import { Suspense } from "react";

const DynamicMap = dynamic(() => import('../components/map'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center p-6">
    <p className="font-semibold">The map is loading...</p>
  </div>,
})

export default function Home() {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-screen w-full flex-col">
          <header className="w-full">
            <TopBar />
          </header>
          <main>
            <h1>Detials</h1>
          </main>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <DynamicMap />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
