import { ModeToggle } from "./darkmode-toggle";
export function TopBar() {
    return ( // Someone please find a way to make that pretty... the size should be dictated by the parent Resizable widget (width) and the height of the logo.
        <div className="shadow-md rounded-md flex flex-row items-center justify-between w-full p-2">
            <img src="/favicon.ico" alt="logo" className="h-12" />
            <ModeToggle />
        </div>
    );
}