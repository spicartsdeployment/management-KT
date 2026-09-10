"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import "./../../Assets/styles/RadioGroup.scss";

function RadioGroup({ className, ...props }) {
    return (
        <RadioGroupPrimitive.Root
            data-slot="radio-group"
            className={["radio-group", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function RadioGroupItem({ className, ...props }) {
    return (
        <RadioGroupPrimitive.Item
            data-slot="radio-group-item"
            className={["radio-group__item", className].filter(Boolean).join(" ")}
            {...props}
        >
            <RadioGroupPrimitive.Indicator
                data-slot="radio-group-indicator"
                className="radio-group__indicator"
            >
                <CircleIcon className="radio-group__dot" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
}

export { RadioGroup, RadioGroupItem };