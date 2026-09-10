
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "./utils";
import "../../../Assets/styles/Alert.scss";

const alertVariants = cva(
    "alert",
    {
        variants: {
            variant: {
                default: "alert--default",
                destructive: "alert--destructive",
            },
            withIcon: {
                true: "alert--with-icon",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Alert({ className, variant, children, ...props }) {
    // Check if children contains an SVG icon as a direct child
    const withIcon = React.Children.toArray(children).some(
        (child) => React.isValidElement(child) && child.type === "svg"
    );
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant, withIcon }), className)}
            {...props}
        >
            {children}
        </div>
    );
}

function AlertTitle({ className, ...props }) {
    return (
        <div
            data-slot="alert-title"
            className={cn("alert__title", className)}
            {...props}
        />
    );
}

function AlertDescription({ className, ...props }) {
    return (
        <div
            data-slot="alert-description"
            className={cn("alert__description", className)}
            {...props}
        />
    );
}

export { Alert, AlertTitle, AlertDescription };
