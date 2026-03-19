/**
 * Web mock for react-native-svg.
 * lucide-react-native depends on this for rendering SVG icons.
 */
const React = require('react');

const passThrough = (name) => {
    const Comp = ({ children, ...props }) => {
        // Map react-native-svg prop names to HTML SVG equivalents
        const webProps = {};
        if (props.width) webProps.width = props.width;
        if (props.height) webProps.height = props.height;
        if (props.viewBox) webProps.viewBox = props.viewBox;
        if (props.fill) webProps.fill = props.fill;
        if (props.stroke) webProps.stroke = props.stroke;
        if (props.strokeWidth) webProps.strokeWidth = props.strokeWidth;
        if (props.strokeLinecap) webProps.strokeLinecap = props.strokeLinecap;
        if (props.strokeLinejoin) webProps.strokeLinejoin = props.strokeLinejoin;
        if (props.d) webProps.d = props.d;
        if (props.cx) webProps.cx = props.cx;
        if (props.cy) webProps.cy = props.cy;
        if (props.r) webProps.r = props.r;
        if (props.x1) webProps.x1 = props.x1;
        if (props.y1) webProps.y1 = props.y1;
        if (props.x2) webProps.x2 = props.x2;
        if (props.y2) webProps.y2 = props.y2;
        if (props.points) webProps.points = props.points;
        if (props.x) webProps.x = props.x;
        if (props.y) webProps.y = props.y;
        if (props.rx) webProps.rx = props.rx;
        if (props.ry) webProps.ry = props.ry;
        if (props.color) webProps.color = props.color;
        if (props.style) webProps.style = props.style;
        if (props.className) webProps.className = props.className;
        if (props.transform) webProps.transform = props.transform;
        if (props.opacity) webProps.opacity = props.opacity;
        if (props.xlinkHref || props.href) webProps.href = props.xlinkHref || props.href;

        return React.createElement(name, webProps, children);
    };
    Comp.displayName = name;
    return Comp;
};

const Svg = ({ children, ...props }) => {
    const webProps = {
        xmlns: 'http://www.w3.org/2000/svg',
        width: props.width || 24,
        height: props.height || 24,
        viewBox: props.viewBox || `0 0 ${props.width || 24} ${props.height || 24}`,
        fill: props.fill,
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        strokeLinecap: props.strokeLinecap,
        strokeLinejoin: props.strokeLinejoin,
        style: props.style,
        className: props.className,
        color: props.color,
    };
 
    Object.keys(webProps).forEach((k) => webProps[k] === undefined && delete webProps[k]);
    return React.createElement('svg', webProps, children);
};

module.exports = {
    default: Svg,
    Svg,
    Circle: passThrough('circle'),
    Ellipse: passThrough('ellipse'),
    G: passThrough('g'),
    Text: passThrough('text'),
    TSpan: passThrough('tspan'),
    TextPath: passThrough('textPath'),
    Path: passThrough('path'),
    Polygon: passThrough('polygon'),
    Polyline: passThrough('polyline'),
    Line: passThrough('line'),
    Rect: passThrough('rect'),
    Use: passThrough('use'),
    Image: passThrough('image'),
    Symbol: passThrough('symbol'),
    Defs: passThrough('defs'),
    LinearGradient: passThrough('linearGradient'),
    RadialGradient: passThrough('radialGradient'),
    Stop: passThrough('stop'),
    ClipPath: passThrough('clipPath'),
    Pattern: passThrough('pattern'),
    Mask: passThrough('mask'),
    Filter: passThrough('filter'),
    ForeignObject: passThrough('foreignObject'),
    Marker: passThrough('marker'),
    SvgCssUri: () => null,
    SvgUri: () => null,
    SvgXml: () => null,
    SvgFromXml: () => null,
    SvgFromUri: () => null,
    SvgWithCss: () => null,
    inlineStyles: () => null,
};
