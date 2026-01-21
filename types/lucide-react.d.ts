declare module 'lucide-react' {
    import { FC, SVGProps } from 'react';
    export interface IconProps extends SVGProps<SVGSVGElement> {
        size?: string | number;
        absoluteStrokeWidth?: boolean;
    }
    export type Icon = FC<IconProps>;
    export const Moon: Icon;
    export const Sun: Icon;
    // Add other icons as needed or use a catch-all
    export const icons: { [key: string]: Icon };
}
