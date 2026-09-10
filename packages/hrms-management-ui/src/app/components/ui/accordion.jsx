"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";


import { cn } from "./utils";
import "../../../Assets/styles/Accordion.scss";

function Accordion(props) {
    return <AccordionPrimitive.Root data-slot="accordion" className="accordion" {...props} />;
}

function AccordionItem({ className, ...props }) {
    return (
        <AccordionPrimitive.Item
            data-slot="accordion-item"
            className={cn("accordion__item", className)}
            {...props}
        />
    );
}

function AccordionTrigger({ className, children, ...props }) {
    return (
        <AccordionPrimitive.Header className="accordion__header">
            <AccordionPrimitive.Trigger
                data-slot="accordion-trigger"
                className={cn("accordion__trigger", className)}
                {...props}
            >
                {children}
                <ChevronDownIcon className="accordion__chevron" />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

function AccordionContent({ className, children, ...props }) {
    return (
        <AccordionPrimitive.Content
            data-slot="accordion-content"
            className={cn("accordion__content", className)}
            {...props}
        >
            <div className="accordion__content-inner">{children}</div>
        </AccordionPrimitive.Content>
    );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
