"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";


import { cn } from "./utils";
import "../../../Assets/styles/Avatar.scss";

function Avatar({ className, ...props }) {
    return (
        <AvatarPrimitive.Root
            data-slot="avatar"
            className={cn("avatar", className)}
            {...props}
        />
    );
}

function AvatarImage({ className, ...props }) {
    return (
        <AvatarPrimitive.Image
            data-slot="avatar-image"
            className={cn("avatar__image", className)}
            {...props}
        />
    );
}

function AvatarFallback({ className, ...props }) {
    return (
        <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className={cn("avatar__fallback", className)}
            {...props}
        />
    );
}

export { Avatar, AvatarImage, AvatarFallback };
