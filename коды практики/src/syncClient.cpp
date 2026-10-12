#include <SocketWrapper/Client.h>

void Client::run(const std::string &host, int serverPort, int clientPort) {
    WsaInitializer wsa;
    ClientSocket client(clientPort);
    std::cout << "[Client] Connecting to server..." << std::endl;
    client.connect(host, serverPort);
    std::cout << "[Client] Connected to server" << std::endl;
    while(true) {
        std::string message;
        std::getline(std::cin, message);
        if (message.empty()) continue;
        client.send(message);
        std::string response = client.receive(2048);
        std::cout << "[Client] Message: " << response << std::endl;
    }
}