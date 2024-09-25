const createVirtualDOM = (element) => {
    if (typeof element === 'string' || typeof element === 'number') {
        return document.createTextNode(element);
    }

    if (typeof element.type === 'function') {
        const componentElement = element.type(element.props); 
        return createVirtualDOM(componentElement); 
    }

    const virtualDOM = document.createElement(element.type);

    Object.entries(element.props).forEach(([key, value]) => {
        if (key !== 'children') {
            if (key.startsWith('on') && typeof value === 'function') {
                const eventType = key.toLowerCase().substring(2);
                virtualDOM.addEventListener(eventType, value);
            } else {
                virtualDOM.setAttribute(key, value);
            }
        }
    });

    const children = element.props.children || [];
    children.forEach((child) => {
        virtualDOM.appendChild(createVirtualDOM(child));
    });

    return virtualDOM;
};

export const updateDOM = (parent, newNode, oldNode) => {
    // TODO: 임시 updateDOM 함수 -> 로직 수정 필요
    if (!oldNode) {
        parent.appendChild(createVirtualDOM(newNode));
    } else if (!newNode) {
        parent.removeChild(parent.childNodes[oldNode.index]);
    } else if (changed(newNode, oldNode)) {
        parent.replaceChild(createVirtualDOM(newNode), parent.childNodes[oldNode.index]);
    } else {
        const newLength = newNode.props.children.length;
        const oldLength = oldNode.props.children.length;

        // **
        for (let i = 0; i < Math.max(newLength, oldLength); i++) {
            updateDOM(parent.childNodes[oldNode.index], newNode.props.children[i], oldNode.props.children[i]);
        }
    }
};

const changed = (node1, node2) => {
    // TODO: 임시 changed 함수 -> 로직 수정 필요
    return typeof node1 !== typeof node2 || (typeof node1 === 'string' && node1 !== node2) || node1.type !== node2.type;
};