var FLAG_AFTERLIFE = "";

(async () => {
    async function encryptValues(values) {
        const encoder = new TextEncoder();
        const password = "ICT2212";
        const salt = encoder.encode("group -21-");
        const iv = encoder.encode("0000000000000000");
    
        if (iv.length !== 16) {
            throw new Error("IV must be 16 bytes long.");
        }
    
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
            ["encrypt"]
        );
    
        const encryptedValues = [];
        for (const value of values) {
            const plaintext = new Uint8Array([value]);
    
            const ciphertext = await window.crypto.subtle.encrypt(
                {
                    name: "AES-CBC",
                    iv: iv
                },
                aesKey,
                plaintext
            );
    
            const ciphertextArray = new Uint8Array(ciphertext);
            const ciphertextHex = Array.from(ciphertextArray)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
    
            encryptedValues.push(ciphertextHex);
        }
    
        return encryptedValues;
    }
    
    async function decryptValues(encryptedValues) {
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        const password = "ICT2212";
        const salt = encoder.encode("group -21-");
        const iv = encoder.encode("0000000000000000");
    
        if (iv.length !== 16) {
            throw new Error("IV must be 16 bytes long.");
        }
    
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
    
        return decryptedValues;
    }

    window.fetch = "Access to Fetch is not allowed. ^-^ Good Luck LOL";
    var originalXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        if (window.canvasMode) {
            return new originalXMLHttpRequest();
        } else {
            console.error("Access to XMLHttpRequest is not allowed. ^-^ Good Luck LOL");
            return null;
        }
    };

    function getToken(){
        window.canvasMode = true;

        var inputs = document.querySelectorAll('input');
        var hiddenInput = 0;
        for (let i = 0; i < inputs.length; i++) {
            if(inputs[i].getAttribute('type') == 'hidden'){
                hiddenInput = inputs[i];
            }
        }
        var sessionID = hiddenInput.value;
    
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/getToken', true);
        xhr.setRequestHeader('_sid', sessionID);
        xhr.setRequestHeader('Content-Type', 'application/json');
        var payload = JSON.stringify({ "from": "frontend" });
        xhr.send(payload);
    
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);            
            } 
            else if (xhr.readyState === 4 && xhr.status == 401) {
                console.error("Try Again");
            }
        };

        window.canvasMode = false;
    }

    function promptLoginErrorMessage(){
        document.getElementById('errorMsg').innerText = "Invalid Credentials";
        setTimeout(function(){
            document.getElementById('errorMsg').innerText = "";
        }, 2000);
    }

    function promptSuccessfulMessage(){
        document.getElementById('errorMsg').innerText = "SUCCESS";
    }

    function getCookie(name) {
        var cookieArr = document.cookie.split(";");
        for(var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");
    
            if(name === cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }

    function loginFunction(){
        window.canvasMode = true;

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        if(username != '' && password != ''){
            var inputs = document.querySelectorAll('input');
            var hiddenInput = 0;
            for (let i = 0; i < inputs.length; i++) {
                if(inputs[i].getAttribute('type') == 'hidden'){
                    hiddenInput = inputs[i];
                }
            }
            var sessionID = hiddenInput.value;
            var token = getCookie('_token');
            if(sessionID){
                if(token){
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/login', true);
                    xhr.setRequestHeader('_sid', sessionID);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    var payload = JSON.stringify({ 
                        "username": username,
                        "password" : password,
                        "t" : Date.now(),
                        "a" : token
                    });
                    xhr.send(payload);
                
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            var response = JSON.parse(xhr.responseText);
                            FLAG_AFTERLIFE = response;
                        } 
                        else if (xhr.readyState === 4 && xhr.status == 401) {
                            promptLoginErrorMessage();
                        }
                    };
                }
                else{
                    promptLoginErrorMessage();
                }
            }
            else{
                promptLoginErrorMessage();
            }
        }
        else{
            promptLoginErrorMessage();
        }

        window.canvasMode = false;
    }

    function _0x789fbc(){
        window.canvasMode = true;
        var token = getCookie('_token');

        var xhr = new XMLHttpRequest();
        xhr.open('POST', `/_0x${token}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        var payload = JSON.stringify({ "flag": "AFTERLOVE" });
        xhr.send(payload);
    
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if(response.status == 200){
                    window.location.href = '/' + response.FLAG_MAGNUS;
                }          
            } 
            else if (xhr.readyState === 4 && xhr.status == 401) {
                console.error("Try Again");
            }
        };
        window.canvasMode = false;
    }

    const _0x000001 = [0x64, 0x56, 0x54];
    const _0x000002 = await encryptValues(
        [_0x000001[0] ^ _0x000001[1], _0x000001[0] ^ _0x000001[2], _0x000001[0] ^ _0x000001[2]]
    );
    
    if(window.location.href.includes('/login')){
        getToken();
        document.getElementById('loginBtn').addEventListener('click', loginFunction);

        setInterval(async function(){
            var _0x000003 = await decryptValues(_0x000002);

            if(FLAG_AFTERLIFE._0x010101 == String.fromCharCode(..._0x000003)){
                _0x789fbc();
            }
        
            if(FLAG_AFTERLIFE != ""){
                FLAG_AFTERLIFE = "";
            }
        }, 1000);

    }
    
})();