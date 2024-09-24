export const createElement = (type, props, ...children) => {
    if (typeof type === "function") {
        return type(null, props, ...children);
    }

    return {
        type,
        props: {
            ...props,
            children
        }
    };
}