(async () => {
    const encryptedValues = [
        '3148ecce0faf78552e56b1cdab6d4068',
        '35fa9089274205e73ce276971acf3af2',
        '35fa9089274205e73ce276971acf3af2'
    ];

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    const password = "ICT2212";
    const salt = encoder.encode("fixed_salt");
    const iv = encoder.encode("fixed_iv_1234567");

    const baseKey = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    const aesKey = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 1000,
            hash: "SHA-256"
        },
        baseKey,
        { name: "AES-CBC", length: 256 },
        false,
        ["decrypt"]
    );

    const decryptedValues = [];
    for (const ciphertextHex of encryptedValues) {
        const ciphertextBytes = new Uint8Array(ciphertextHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        const plaintext = await window.crypto.subtle.decrypt(
            {
                name: "AES-CBC",
                iv: iv
            },
            aesKey,
            ciphertextBytes.buffer
        );

        const plaintextArray = new Uint8Array(plaintext);
        decryptedValues.push(plaintextArray[0]);
    }

    console.log("Decrypted Values:", decryptedValues);
    const statusCode = String.fromCharCode(...decryptedValues);
    console.log("Status Code:", statusCode);
})();