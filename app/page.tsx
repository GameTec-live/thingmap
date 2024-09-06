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
  loading: () => <p>A map is loading</p>,
})

export default function Home() {
  /*return (
    <div>
    <header>
      <TopBar />
    </header>
    <main className="">
      <Button>Test</Button>
    </main>
    </div>
  );*/
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-screen">
          <header>
            <TopBar />
          </header>
          <main>
            
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
