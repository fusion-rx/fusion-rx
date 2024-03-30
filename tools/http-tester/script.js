// @ts-check

/** 
@typedef {'primary' | 'accent' | 'warn' | 'default'} color
**/

/**
 * Converts an object to a query string.
 * @param {Record<string, any>} params
 */
function makeQueryString(params) {
    const qs = [];

    for (let key in params) {
        const val = params[key];

        if (Array.isArray(val)) {
            qs.push([key, val.join(',')].join('='));
        } else {
            qs.push([key, val].join('='));
        }
    }

    return qs.length > 0 ? '?' + qs.join('&') : '';
}

/**
 * Adds a color style to an HtmlElement.
 * @param {HTMLElement} node
 * @param {color} color
 */
function assignColor(node, color) {
    node.classList.add(color);
}

/**
 *
 * @param {string} text
 * @param {color} color
 * @param {(event: MouseEvent) => void} onClick
 */
function makeButton(text, color, onClick) {
    const button = document.createElement('button');
    button.appendChild(document.createTextNode(text));
    button.onclick = onClick;
    assignColor(button, color);
    return button;
}

/**
 * Creates a label for a text input.
 * @param {string} text
 * @returns {HTMLDivElement}
 */
function makeLabel(text) {
    const labelDiv = document.createElement('div');
    labelDiv.classList.add('elm-input-label');
    labelDiv.appendChild(document.createTextNode(text));
    return labelDiv;
}

/**
 * Creates a text input.
 * @param {string} labelText
 * @param {HTMLElement} input
 */
function makeInput(labelText, input) {
    const inputDiv = document.createElement('div');
    inputDiv.classList.add('elm-input-wrapper');
    inputDiv.appendChild(makeLabel(labelText));

    input.classList.add('elm-input');
    inputDiv.appendChild(input);

    return inputDiv;
}

/**
 * Creates the input for an auth token.
 * @returns { HTMLDivElement }
 */
function makeTokenInput() {
    const token = document.createElement('input');

    const storedToken = window.sessionStorage.getItem('token');
    if (storedToken) token.value = storedToken;

    token.oninput = () => {
        window.sessionStorage.setItem('token', token.value);
    };

    return makeInput('Auth Token', token);
}

/**
 * Creates the "Submit" button.
 * @returns {HTMLButtonElement}
 */
function makeSubmitButton() {
    const submit = document.createElement('button');
    submit.appendChild(document.createTextNode('Submit'));
    return submit;
}

const output = document.createElement('div');
output.classList.add('elm-form', 'output');

const method = document.createElement('input');
const methodInput = makeInput('Method', method);
methodInput.style.flexGrow = '0';
method.value = 'get';

const url = document.createElement('input');
const urlInput = makeInput('URL', url);

const token = makeTokenInput();

const query = document.createElement('div');
query.contentEditable = 'true';
/** @param {KeyboardEvent} event */
query.onkeydown = (event) => {
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        query.innerText = JSON.stringify(JSON.parse(query.innerText), null, 4);
    }
};
query.onkeyup = () => {
    try {
        JSON.parse(query.innerText);
        query.classList.remove('elm-form-error');
    } catch (e) {
        query.classList.add('elm-form-error');
    }
};
const queryInput = makeInput('JSON Query | Format with Ctrl+f', query);
queryInput.style.flexBasis = '100%';

const submit = makeButton('Submit', 'accent', () => {
    let q = {};

    try {
        if (query.innerText.length > 0) {
            q['queryString'] = makeQueryString(JSON.parse(query.innerText));
        }
    } catch (e) {
        console.error('Failed to stringify query string.');
    }

    fetch('/' + method + '?protocol=' + method.value ?? 'https' + '&', {
        method: 'get',
        headers: {
            Authorization: window.sessionStorage.getItem('token') ?? ''
        }
    });
});

const form = document.createElement('div');
form.classList.add('elm-form');
form.appendChild(methodInput);
form.appendChild(urlInput);
form.appendChild(queryInput);
form.appendChild(token);
form.appendChild(submit);

const body = document.getElementById('body');

if (body) {
    body.appendChild(form);
    body.appendChild(output);
}
