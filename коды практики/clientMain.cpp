#include <SocketWrapper/Client.h>

int main() {
    WSADATA wsaData;
int r = WSAStartup(MAKEWORD(2,2), &wsaData);
std::cerr << "WSAStartup = " << r << " (0=OK)" << std::endl;
    Client client;
    std::string host;
    int port;
    std::cout << "[Client] Enter host IP: ";
    std::getline(std::cin, host);
    std::cout << "[Client] Enter port: ";
    std::cin >> port;
    try { client.run(host, port, 8000); }
    catch (const std::exception& e) {
        std::cerr << "[Client] Error: " << e.what() << std::endl;
        return -1;
    }
    return 0;
}