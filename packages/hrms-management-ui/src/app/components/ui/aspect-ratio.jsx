"use client";


import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import "../../../Assets/styles/AspectRatio.scss";

function AspectRatio(props) {
    return <AspectRatioPrimitive.Root data-slot="aspect-ratio" className="aspect-ratio" {...props} />;
}

export { AspectRatio };
