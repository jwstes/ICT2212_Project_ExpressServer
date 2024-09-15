class Tools{
    constructor(){

    }

    async randomString(){
        return Math.random().toString(36).slice(2);
    }

    async generateRandomString() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const stringLength = 6;
        let randomString = '';
        for (let i = 0; i < stringLength; i++) {
            const randomNumber = Math.floor(Math.random() * chars.length);
            randomString += chars.charAt(randomNumber);
        }
        return randomString;
    }

}

module.exports = new Tools();