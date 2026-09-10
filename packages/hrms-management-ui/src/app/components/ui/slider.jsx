"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import "../../../Assets/styles/Slider.scss";

function Slider({
    className = "",
    defaultValue,
    value,
    min = 0,
    max = 100,
    ...props
}) {
    const _values = React.useMemo(
        () =>
            Array.isArray(value)
                ? value
                : Array.isArray(defaultValue)
                    ? defaultValue
                    : [min],
        [value, defaultValue, min]
    );

    return (
        <SliderPrimitive.Root
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            className={`slider ${className}`}
            {...props}
        >
            <SliderPrimitive.Track className="slider__track">
                <SliderPrimitive.Range className="slider__range" />
            </SliderPrimitive.Track>

            {Array.from({ length: _values.length }, (_, index) => (
                <SliderPrimitive.Thumb
                    key={index}
                    className="slider__thumb"
                />
            ))}
        </SliderPrimitive.Root>
    );
}

export { Slider };