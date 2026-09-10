"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import "../../../Assets/styles/Toaster.scss";

const Toaster = (props) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme}
            className="toaster"
            {...props}
        />
    );
};

export { Toaster };