import { Intent,Position,Toaster } from "@blueprintjs/core";

export default Toaster.create({
    position:Position.TOP,
    intent:Intent.PRIMARY,
    maxToasts:1
})