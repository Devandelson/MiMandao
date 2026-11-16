const checkImageExists = (url: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;

        img.onload = () => {
            resolve(true);
        };

        img.onerror = () => {
            reject(false);
        };
    });
};

export default checkImageExists;