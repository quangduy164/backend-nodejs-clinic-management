const os = require('os');

// Hàm lấy địa chỉ IPv4 của adapter Wi-Fi
function getWifiIPv4Address() {
    const networkInterfaces = os.networkInterfaces();
    let wifiIPv4 = null;

    // Duyệt qua các adapter mạng để tìm Wi-Fi adapter
    for (const adapterName in networkInterfaces) {
        const adapter = networkInterfaces[adapterName];

        // Tìm adapter có chứa địa chỉ IPv4
        for (const config of adapter) {
            if (config.family === 'IPv4' && !config.internal) {
                if (adapterName.includes('Wi-Fi') || adapterName.includes('wlan')) {
                    wifiIPv4 = config.address;
                    break;
                }
            }
        }

        // Dừng lại nếu đã tìm thấy địa chỉ IPv4 của Wi-Fi adapter
        if (wifiIPv4) break;
    }

    return wifiIPv4;
}

module.exports = {
    getWifiIPv4Address
}