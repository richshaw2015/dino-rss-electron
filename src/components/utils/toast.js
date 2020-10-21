
export function shortToast(msg) {
    M.toast({html: msg, displayLength: 1500});
}

export function toast(msg) {
    M.toast({html: msg, displayLength: 3000});
}

export function warnToast(msg) {
    const html = '<span style="color: #eeff41;">' + msg + '</span>';
    M.toast({html: html, displayLength: 4500});
}
